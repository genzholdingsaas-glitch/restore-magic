import { motion } from 'framer-motion';
import { Clock, CheckCircle, Loader2, AlertCircle, Image } from 'lucide-react';

type OrderStatus = 'DRAFT' | 'AWAITING_OFFER' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

interface MockOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  thumbnail: string;
}

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Clock; color: string }> = {
  DRAFT: { label: 'Rascunho', icon: Clock, color: 'text-muted-foreground' },
  AWAITING_OFFER: { label: 'Aguardando oferta', icon: Clock, color: 'text-gold' },
  AWAITING_PAYMENT: { label: 'Aguardando pagamento', icon: Clock, color: 'text-gold' },
  PAID: { label: 'Pago', icon: CheckCircle, color: 'text-success' },
  PROCESSING: { label: 'Processando', icon: Loader2, color: 'text-accent' },
  COMPLETED: { label: 'Concluído', icon: CheckCircle, color: 'text-success' },
  FAILED: { label: 'Falhou', icon: AlertCircle, color: 'text-destructive' },
  REFUNDED: { label: 'Reembolsado', icon: Clock, color: 'text-muted-foreground' },
};

// Mock data for demo
const mockOrders: MockOrder[] = [];

const OrdersHistory = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">Seus pedidos de restauração</p>
      </div>

      <div className="px-5">
        {mockOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 font-semibold text-foreground">Nenhum pedido ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Restaure sua primeira foto para vê-la aqui
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {mockOrders.map((order, i) => {
              const cfg = statusConfig[order.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card"
                >
                  <img
                    src={order.thumbnail}
                    alt="Miniatura"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      Pedido #{order.id.slice(-6)}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{cfg.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
