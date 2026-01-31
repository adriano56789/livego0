

export const CURRENT_USER_ID = 'me';

export const getRemainingDays = (expirationDate?: string | null): number => {
    if (!expirationDate) return 0;
    const expiration = new Date(expirationDate);
    const now = new Date();
    
    // Retorna 0 se a data de expiração for inválida
    if (isNaN(expiration.getTime())) return 0;

    const diffTime = expiration.getTime() - now.getTime();
    if (diffTime <= 0) return 0;

    // Calcula a diferença em dias e arredonda para cima
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


export const getFrameGlowClass = (frameId?: string | null) => {
    if (!frameId) return '';
    return 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]';
};

export const avatarFramesData = [
    { id: 'FrameBlazingSun', name: 'Sol Escaldante', price: 500, duration: 30 },
    { id: 'FrameBlueCrystal', name: 'Cristal Azul', price: 300, duration: 30 },
    { id: 'FrameBlueFire', name: 'Fogo Azul', price: 600, duration: 30 },
    { id: 'FrameDiamond', name: 'Diamante', price: 1000, duration: 30 },
    { id: 'FrameFloralWreath', name: 'Coroa Floral', price: 400, duration: 30 },
    { id: 'FrameGoldenFloral', name: 'Floral Dourado', price: 800, duration: 30 },
    { id: 'FrameIcyWings', name: 'Asas de Gelo', price: 1200, duration: 30 },
    { id: 'FrameMagentaWings', name: 'Asas Magenta', price: 1100, duration: 30 },
    { id: 'FrameNeonDiamond', name: 'Diamante Neon', price: 1500, duration: 30 },
    { id: 'FrameNeonPink', name: 'Neon Rosa', price: 750, duration: 30 },
    { id: 'FrameOrnateBronze', name: 'Bronze Ornate', price: 250, duration: 30 },
    { id: 'FramePinkGem', name: 'Gema Rosa', price: 900, duration: 30 },
    { id: 'FramePinkLace', name: 'Renda Rosa', price: 350, duration: 30 },
    { id: 'FramePurpleFloral', name: 'Floral Roxo', price: 650, duration: 30 },
    { id: 'FrameRegalPurple', name: 'Roxo Real', price: 2000, duration: 30 },
    { id: 'FrameRoseHeart', name: 'Coração de Rosa', price: 1800, duration: 30 },
    { id: 'FrameSilverBeaded', name: 'Prata Frisado', price: 200, duration: 30 },
    { id: 'FrameSilverThorn', name: 'Espinho de Prata', price: 450, duration: 30 }
];

export const db_frontend_stub = {
    liveSessions: new Map<string, any>()
};