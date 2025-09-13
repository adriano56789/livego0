
import React from 'react';
import ChevronLeftIcon from '../components/ChevronLeftIcon';

const HELP_CONTENT: { [key: string]: React.ReactNode } = {
    "Como fazer recargas?": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Fazendo uma Recarga de Diamantes</h2>
            <p className="text-gray-300 leading-relaxed">
                Recarregar seus diamantes é um processo simples! Siga estes passos:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 pl-4">
                <li>Navegue até a sua tela de <strong>Perfil</strong>.</li>
                <li>Toque na opção <strong>Carteira</strong>, que mostra seus saldos atuais.</li>
                <li>Na tela da Carteira, certifique-se de que a aba <strong>"Diamante"</strong> está selecionada.</li>
                <li>Escolha um dos pacotes de diamantes disponíveis que melhor atenda às suas necessidades.</li>
                <li>Você será redirecionado para a tela de confirmação de compra, onde poderá selecionar seu método de pagamento preferido (Transferência ou Cartão de Crédito).</li>
                <li>Siga as instruções para completar o pagamento.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed mt-4">
                Seus diamantes serão creditados em sua conta assim que o pagamento for confirmado.
            </p>
        </div>
    ),
    "Problemas com saque": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Solucionando Problemas de Saque</h2>
            <p className="text-gray-300 leading-relaxed">
                Se você está enfrentando problemas para sacar seus ganhos, verifique os seguintes pontos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4">
                <li><strong>Método de Saque:</strong> Certifique-se de que seu método de saque (PIX ou Mercado Pago) está configurado corretamente com as informações corretas.</li>
                <li><strong>Valor Mínimo:</strong> Verifique se você atingiu o valor mínimo necessário para solicitar um saque.</li>
                <li><strong>Processamento:</strong> Lembre-se que os saques podem levar algum tempo para serem processados. Aguarde o prazo informado.</li>
                <li><strong>Taxas:</strong> Esteja ciente da taxa de plataforma de 20% que é deduzida do valor bruto do saque.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
                Se o problema persistir após verificar todos os pontos, entre em contato com o <strong>Chat com Suporte</strong>.
            </p>
        </div>
    ),
    "Como iniciar uma transmissão?": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Iniciando sua Transmissão ao Vivo</h2>
            <p className="text-gray-300 leading-relaxed">
                Compartilhar seus momentos ao vivo é fácil. Siga os passos abaixo:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 pl-4">
                <li>Na barra de navegação inferior, toque no botão central com o ícone de <strong>Play</strong>.</li>
                <li>A tela "Go Live" será aberta, mostrando a prévia da sua câmera.</li>
                <li>Adicione uma <strong>capa</strong> e um <strong>título</strong> atraente para sua live.</li>
                <li>Selecione a <strong>categoria</strong> da sua transmissão (ex: PK, Música, Dança).</li>
                <li>Configure outras opções como <strong>Efeitos de Beleza</strong> ou <strong>Batalha PK</strong>.</li>
                <li>Quando estiver tudo pronto, toque no botão verde <strong>"Iniciar Transmissão"</strong>.</li>
            </ol>
        </div>
    ),
    "Segurança da conta e privacidade": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Protegendo Sua Conta</h2>
            <p className="text-gray-300 leading-relaxed">
                Manter sua conta segura é nossa prioridade. Aqui estão algumas dicas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4">
                <li><strong>Senha Forte:</strong> Se você usa um método de login com senha, certifique-se de que ela seja forte e única.</li>
                <li><strong>Não compartilhe informações:</strong> Nunca compartilhe seus dados de login com ninguém.</li>
                <li><strong>Cuidado com Phishing:</strong> Desconfie de links ou mensagens suspeitas pedindo suas informações. O LiveGo nunca pedirá sua senha fora do aplicativo.</li>
                <li><strong>Configurações de Privacidade:</strong> Vá em {"Configurações > Configurações de privacidade"} para controlar quem pode te enviar mensagens, ver sua localização, etc.</li>
                <li><strong>Proteção de Avatar:</strong> Ative a proteção de avatar em seu perfil para evitar que outros usem sua foto.</li>
            </ul>
        </div>
    ),
    "Regras da comunidade": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Nossas Regras da Comunidade</h2>
             <p className="text-gray-300 leading-relaxed">
                No LiveGo, promovemos a máxima liberdade de expressão. No entanto, temos uma regra fundamental e inegociável para garantir a segurança de todos.
            </p>
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 space-y-2">
                 <h3 className="text-lg font-bold text-red-400">Tolerância Zero com Menores de Idade</h3>
                 <p className="text-red-200">
                    É estritamente proibido transmitir, exibir ou envolver menores de 18 anos em qualquer conteúdo na plataforma. A violação desta regra resultará no banimento imediato e permanente da conta.
                </p>
            </div>
            <p className="text-gray-300 leading-relaxed pt-2">
                Fora esta regra essencial, nossa filosofia é: seu palco, suas regras.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4">
                <li><strong>Liberdade de Expressão:</strong> Fora a restrição sobre menores, encorajamos a autenticidade e a criatividade sem barreiras.</li>
                <li><strong>Conteúdo sem Limites:</strong> Você define o conteúdo da sua transmissão, desde que não envolva menores de idade.</li>
                <li><strong>Responsabilidade do Criador:</strong> Confiamos em nossos streamers. A responsabilidade pelo conteúdo transmitido é inteiramente sua, incluindo a garantia de que nenhum menor de idade esteja envolvido.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
                Aproveite a plataforma para criar e compartilhar com liberdade e responsabilidade.
            </p>
        </div>
    ),
    "Solução de problemas de conexão": (
        <div className="space-y-4 text-left">
            <h2 className="text-xl font-bold text-white">Problemas de Conexão</h2>
            <p className="text-gray-300 leading-relaxed">
                Uma transmissão travando ou com lag? Tente estas soluções:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 pl-4">
                <li><strong>Verifique sua Internet:</strong> Certifique-se de que você está conectado a uma rede Wi-Fi estável ou tem um bom sinal de dados móveis.</li>
                <li><strong>Reinicie o App:</strong> Feche completamente o aplicativo LiveGo e abra-o novamente.</li>
                <li><strong>Reinicie seu Dispositivo:</strong> Às vezes, um simples reinício do seu celular pode resolver problemas de conexão.</li>
                <li><strong>Reduza a Qualidade:</strong> Se você for um streamer, tente diminuir a qualidade da transmissão nas ferramentas ao vivo para reduzir a carga na sua conexão.</li>
                <li><strong>Verifique Atualizações:</strong> Garanta que você está com a versão mais recente do LiveGo instalada.</li>
            </ul>
        </div>
    ),
};


interface HelpTopicScreenProps {
    setActiveScreen: (screen: string) => void;
    topic: string;
}

const HelpTopicScreen: React.FC<HelpTopicScreenProps> = ({ setActiveScreen, topic }) => {
    const content = HELP_CONTENT[topic] || (
        <p className="text-gray-500">
            Conteúdo para "{topic}" não foi encontrado. Por favor, tente novamente ou contate o suporte.
        </p>
    );

    return (
        <div className="bg-[#121212] h-full text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800 flex-shrink-0">
                <button onClick={() => setActiveScreen('helpCenter')} className="absolute">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold truncate px-12">
                    {topic}
                </h1>
            </header>
            <main className="flex-grow p-6 text-gray-300 overflow-y-auto no-scrollbar">
                {content}
            </main>
        </div>
    );
};

export default HelpTopicScreen;
