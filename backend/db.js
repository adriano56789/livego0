// Simulação de um banco de dados em memória para o backend.

const selfUser = {
    name: 'Seu Perfil',
    avatarUrl: 'https://picsum.photos/seed/profile/100/100',
    coverUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    country: 'br',
    id: '10755083',
    age: 22,
    gender: 'male',
    level: 6,
    location: 'Brasil, São Paulo',
    distance: '0,00 km',
    fans: '3',
    following: '3',
    receptores: '125,00 mil',
    enviados: '0',
    topFansAvatars: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'],
    isLive: false,
};

const createInitialDB = () => {
    const users = {};
    
    const allMockUsers = [
        selfUser,
        {
            name: 'Lest Go 500 K...',
            avatarUrl: 'https://i.pravatar.cc/150?img=2',
            coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop',
            country: 'br',
            id: '55218901',
            age: 22,
            gender: 'female',
            level: 21,
            location: 'Brasil, Rio de Janeiro',
            distance: '12,34 km',
            fans: '1.2M',
            following: '150',
            receptores: '5.6M',
            enviados: '1.2K',
            topFansAvatars: ['https://i.pravatar.cc/150?img=17', 'https://i.pravatar.cc/150?img=20'],
            isLive: true,
        },
        { name: 'Rainha PK', id: '66345102', avatarUrl: 'https://i.pravatar.cc/150?img=1', coverUrl: 'https://picsum.photos/seed/cover1/400/200', country: 'us', age: 25, gender: 'female', level: 30, location: 'USA, California', distance: '5,43 km', fans: '2.1M', following: '12', receptores: '10.2M', enviados: '5.2K', topFansAvatars: [], isLive: true},
        { name: 'PK Pro', id: '99887705', avatarUrl: 'https://i.pravatar.cc/150?img=3', coverUrl: 'https://picsum.photos/seed/cover3/400/200', country: 'br', age: 28, gender: 'male', level: 15, location: 'Brasil, Bahia', distance: '150,11 km', fans: '500K', following: '300', receptores: '2.1M', enviados: '400', topFansAvatars: [], isLive: false},
        { name: 'Fernando1135', id: '14431934', avatarUrl: 'https://i.pravatar.cc/150?img=4', coverUrl: 'https://picsum.photos/seed/cover4/400/200', country: 'br', age: 19, gender: 'male', level: 5, location: 'Brasil, Curitiba', distance: '2,33 km', fans: '10K', following: '50', receptores: '50K', enviados: '120', topFansAvatars: [], isLive: false},
        { name: 'DJ Code', id: '12345678', avatarUrl: 'https://picsum.photos/seed/4/400/600', coverUrl: 'https://picsum.photos/seed/cover5/400/200', country: 'us', age: 31, gender: 'male', level: 25, location: 'USA, New York', distance: '10,01 km', fans: '800K', following: '10', receptores: '4.5M', enviados: '1.1K', topFansAvatars: [], isLive: true},
        { name: 'Aventureira', id: '87654321', avatarUrl: 'https://picsum.photos/seed/5/400/600', coverUrl: 'https://picsum.photos/seed/cover6/400/200', country: 'br', age: 24, gender: 'female', level: 18, location: 'Brasil, Amazonas', distance: '1200,4 km', fans: '350K', following: '89', receptores: '1.8M', enviados: '600', topFansAvatars: [], isLive: false},
        {
            name: 'Suporte LiveGo',
            avatarUrl: 'https://picsum.photos/seed/support/150/150',
            coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
            country: 'br',
            id: 'support-01',
            age: 0,
            gender: 'female',
            level: 99,
            location: 'Online',
            distance: '0 km',
            fans: 'N/A',
            following: 'N/A',
            receptores: 'N/A',
            enviados: 'N/A',
            topFansAvatars: [],
            isLive: false,
        }
    ];

    allMockUsers.forEach(user => {
        users[user.id] = user;
    });

    const conversations = {
        [selfUser.id]: {
            '55218901': [
                { id: `msg-${Date.now()}`, senderId: '55218901', text: 'Olá! Tudo bem?', timestamp: Date.now() - 3 * 60 * 60 * 1000 },
                { id: `msg-${Date.now()+1}`, senderId: selfUser.id, text: 'Tudo sim, e com você?', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
            ]
        }
    };
    
    const streams = [
      { id: 1, title: 'Desafio PK', streamer: 'Lest Go 500...', viewers: 0, country: 'br', imageUrl: 'https://picsum.photos/seed/1/400/600', tags: ['PK', 'Evento de PK']},
      { id: 2, title: 'Festa dançante!', streamer: 'Rainha PK', viewers: 0, country: 'br', imageUrl: 'https://picsum.photos/seed/2/400/600', tags: ['Dança', 'PK']},
      { id: 3, title: 'Sessão Privada', streamer: 'PK Pro', viewers: 0, country: 'br', imageUrl: 'https://picsum.photos/seed/3/400/600', tags: ['Privada']},
      { id: 4, title: 'Música ao vivo', streamer: 'DJ Code', viewers: 1200, country: 'us', imageUrl: 'https://picsum.photos/seed/4/400/600', tags: ['Música']},
      { id: 5, title: 'Novo no LiveGo!', streamer: 'Aventureira', viewers: 350, country: 'br', imageUrl: 'https://picsum.photos/seed/5/400/600', tags: ['Novo']},
      { id: 6, title: 'Festa na piscina', streamer: 'Summer Vibes', viewers: 5600, country: 'us', imageUrl: 'https://picsum.photos/seed/6/400/600', tags: ['Festa']},
    ];


    return {
        streams,
        users,
        conversations,
        wallet: {
            [selfUser.id]: {
                diamonds: 50000,
                earnings: 125000
            }
        },
        followers: {
            [selfUser.id]: ['55218901', '99887705', '14431934'],
            '55218901': [selfUser.id]
        },
        following: {
            [selfUser.id]: ['66345102', '12345678', '87654321'],
        },
        visitors: {
             [selfUser.id]: ['55218901', '66345102']
        },
        blocklist: {
            [selfUser.id]: ['14431934'] // Exemplo: Usuário principal bloqueou 'Fernando1135'
        }
    };
};

// Exportamos uma instância única da nossa "DB"
module.exports = createInitialDB();