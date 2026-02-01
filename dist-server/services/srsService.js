import config from '../config/settings.js';
class SrsService {
    baseUrl;
    apiToken;
    constructor() {
        // A URL interna do Docker geralmente é http://127.0.0.1:1985 ou http://srs:1985 dependendo da rede
        this.baseUrl = config.srsApiUrl;
        // Token definido no srs.conf para proteger a API
        this.apiToken = process.env.SRS_API_TOKEN || '';
    }
    async request(method, endpoint, body) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        // Adiciona autenticação se configurada
        if (this.apiToken) {
            headers['Authorization'] = `Bearer ${this.apiToken}`;
        }
        console.log(`[SRS Service] ${method} ${url}`);
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`SRS Error (${response.status}): ${text}`);
            }
            const json = await response.json();
            // O SRS retorna code 0 para sucesso
            if (json.code !== 0) {
                throw new Error(`SRS API Error Code ${json.code}: ${JSON.stringify(json)}`);
            }
            return json;
        }
        catch (error) {
            console.error(`[SRS Service] Falha na requisição para ${endpoint}:`, error.message);
            throw error;
        }
    }
    /**
     * Negocia a troca de SDP para publicação WebRTC (WHIP Standard-ish).
     * O Frontend envia o Offer, o SRS processa e retorna o Answer.
     */
    async rtcPublish(sdp, streamUrl) {
        const payload = {
            api: `${this.baseUrl}/rtc/v1/publish`,
            streamurl: streamUrl,
            sdp: sdp
        };
        const response = await this.request('POST', '/rtc/v1/publish', payload);
        if (!response.sdp) {
            throw new Error("SRS não retornou o SDP Answer.");
        }
        return {
            sdp: response.sdp,
            sessionId: response.sessionid
        };
    }
    /**
     * Recupera detalhes de um cliente específico pelo ID.
     */
    async getClient(clientId) {
        const res = await this.request('GET', `/v1/clients/${clientId}`);
        return res.client; // Retorna o objeto do cliente (contém stream, ip, type, etc)
    }
    /**
     * Derruba um cliente (Kick).
     * Útil para moderação ou encerrar lives forçadamente.
     */
    async kickClient(clientId) {
        await this.request('DELETE', `/v1/clients/${clientId}`);
        return true;
    }
    /**
     * Obtém estatísticas vitais do servidor.
     */
    async getSummaries() {
        const res = await this.request('GET', '/v1/summaries');
        return res.data;
    }
    /**
     * Lista todas as streams ativas no servidor.
     */
    async getStreams() {
        const res = await this.request('GET', '/v1/streams');
        return res.streams || []; // Ajuste conforme estrutura exata do SRS v5/v6
    }
    /**
     * Lista todos os clientes conectados.
     */
    async getClients() {
        const res = await this.request('GET', '/v1/clients');
        return res.clients || [];
    }
}
export const srsService = new SrsService();
