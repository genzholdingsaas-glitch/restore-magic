import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESTORATION_PROMPT = `Restaurar esta imagem antiga mantendo 100% da fidelidade ao conteúdo original. Não adicionar, remover ou inventar objetos, pessoas ou elementos que não existam na foto original. Manter composição, enquadramento e proporções intactas.

SEMPRE aplicar colorização realista e historicamente plausível, mesmo que a imagem original esteja em preto e branco ou sépia.

Melhorar significativamente a qualidade da imagem com foco em:
- Aumentar nitidez e definição de detalhes
- Corrigir desfoque leve
- Ajustar contraste e iluminação de forma natural
- Aplicar cores vivas, naturais e equilibradas
- Garantir tons de pele realistas
- Respeitar cores coerentes com o período histórico
- Preservar textura original da fotografia

Remover completamente sinais de deterioração como:
- Mofo, Rasgos, Arranhões, Manchas, Dobras, Poeira, Ruídos excessivos, Descoloração causada pelo tempo

Reconstruir áreas danificadas com base apenas nas informações visuais já presentes na imagem, sem criar novos detalhes artificiais.

Resultado final deve ser ultrarealista, limpo, nítido, colorido com naturalidade histórica, aparência de fotografia restaurada profissionalmente, mantendo total fidelidade histórica e visual à imagem original.

NÃO: Adicionar objetos inexistentes, alterar rosto, modificar traços faciais, mudar identidade da pessoa, alterar expressão, trocar roupas, mudar fundo, criar elementos novos, exagerar saturação, cores irreais, aparência artificial, efeito pintura, efeito cartoon, estilo artístico, super suavização plástica, distorções faciais.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, imageUrl } = await req.json();

    if (!orderId || !imageUrl) {
      return new Response(
        JSON.stringify({ error: "orderId and imageUrl are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update order status to PROCESSING
    await supabase
      .from("orders")
      .update({ status: "PROCESSING" })
      .eq("id", orderId);

    console.log("Calling AI gateway for image restoration...");

    // Call Lovable AI Gateway with Gemini image model
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: RESTORATION_PROMPT },
                { type: "image_url", image_url: { url: imageUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        await supabase.from("orders").update({ status: "FAILED" }).eq("id", orderId);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        await supabase.from("orders").update({ status: "FAILED" }).eq("id", orderId);
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await supabase.from("orders").update({ status: "FAILED" }).eq("id", orderId);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");

    const restoredImageBase64 =
      aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!restoredImageBase64) {
      console.error("No image in AI response:", JSON.stringify(aiData).slice(0, 500));
      await supabase.from("orders").update({ status: "FAILED" }).eq("id", orderId);
      return new Response(
        JSON.stringify({ error: "AI did not return an image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract base64 data and upload to storage
    const base64Data = restoredImageBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const binaryData = Uint8Array.from(atob(base64Data), (c) =>
      c.charCodeAt(0)
    );

    const outputPath = `output/${orderId}.png`;
    const { error: uploadError } = await supabase.storage
      .from("restorations")
      .upload(outputPath, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      await supabase.from("orders").update({ status: "FAILED" }).eq("id", orderId);
      throw new Error(`Failed to upload restored image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("restorations")
      .getPublicUrl(outputPath);

    const outputImageUrl = publicUrlData.publicUrl;

    // Update order with result
    await supabase
      .from("orders")
      .update({
        status: "COMPLETED",
        output_image_url: outputImageUrl,
      })
      .eq("id", orderId);

    console.log("Restoration complete:", outputImageUrl);

    return new Response(
      JSON.stringify({ success: true, outputImageUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("restore-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
