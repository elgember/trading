import { NextResponse } from 'next/server';
import ccxt from 'ccxt';

const exchange = new ccxt.bitso({
    apiKey: process.env.BITSO_API_KEY,
    secret: process.env.BITSO_API_SECRET,
}); 

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.secretToken !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { action, symbol = 'BYC/MXN', amount } = body;

        let order;

        if (action === 'BUY') {
            order = await exchange.createMarketBuyOrder(symbol, amount);
        } else if (action === 'SELL') {
            order = await exchange.createMarketSellOrder(symbol, amount);
        } else {
            return NextResponse.json({ error: 'Accion no valida' }, { status: 400 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: unknown) {
        if (error instanceof Error ) {
            return NextResponse.json({ Error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Ocurrio un error desconocido al ejecutar la orden'}, {status: 500});
    }
}