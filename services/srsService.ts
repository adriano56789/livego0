
import config from '../config/settings.js';

interface SrsResponse {
    code: number;
    server?: string;
    service?: string;
    pid?: string;
    data?: any;
    sdp?: string;
    sessionid?: string;
}

class SrsService {
    private baseUrl: string;
    private apiToken: string;

    constructor() {
        // A URL interna do Docker geralmente é http://127.0.0.1:1985 ou http://srs:1985 dependendo da rede
        this.baseUrl = config.srsApiUrl; 
        // Token definido no srs.conf para proteger a API
        this.apiToken = process.env.SRS_API_TOKEN || ''; 
    }

    private async request(method: string, endpoint: string, body?: any): Promise<any> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers: any = {
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

            const json = await response.json() as SrsResponse;
            
            // O SRS retorna code 0 para sucesso
            if (json.code !== 0) {
                throw new Error(`SRS API Error Code ${json.code}: ${JSON.stringify(json)}`);
            }

            return json;
        } catch (error: any) {
            console.error(`[SRS Service] Falha na requisição para ${endpoint}:`, error.message);
            throw error;
        }
    }

    /**
     * Negocia a troca de SDP para publicação WebRTC (WHIP Standard-ish).
     * O Frontend envia o Offer, o SRS processa e retorna o Answer.
     */
    async rtcPublish(sdp: string, streamUrl: string): Promise<{ sdp: string, sessionId: string }> {
        // Garante que a URL base termine com uma barra
        const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
        const apiUrl = `${baseUrl}rtc/v1/publish/`;
        
        const payload = {
            api: apiUrl,
            streamurl: streamUrl,
            sdp: sdp
        };

        // Adiciona a barra no final do endpoint
        const response = await this.request('POST', '/rtc/v1/publish/', payload);
        
        if (!response.sdp) {
            throw new Error("SRS não retornou o SDP Answer.");
        }

        return {
            sdp: response.sdp,
            sessionId: response.sessionid
        };
    }

    /**
     * Negocia a troca de SDP para reprodução WebRTC (WHEP-like).
     */
    async rtcPlay(sdp: string, streamUrl: string): Promise<{ sdp: string, sessionId: string }> {
        const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
        const apiUrl = `${baseUrl}rtc/v1/play/`;

        const payload = {
            api: apiUrl,
            streamurl: streamUrl,
            sdp,
        };

        const response = await this.request('POST', '/rtc/v1/play/', payload);

        if (!response.sdp) {
            throw new Error('SRS não retornou o SDP Answer para reprodução.');
        }

        return {
            sdp: response.sdp,
            sessionId: response.sessionid,
        };
    }

    /**
     * Recupera detalhes de um cliente específico pelo ID.
     */
    async getClient(clientId: string): Promise<any> {
        const res = await this.request('GET', `/v1/clients/${clientId}`);
        return res.client; // Retorna o objeto do cliente (contém stream, ip, type, etc)
    }

    /**
     * Derruba um cliente (Kick).
     * Útil para moderação ou encerrar lives forçadamente.
     */
    async kickClient(clientId: string): Promise<boolean> {
        await this.request('DELETE', `/v1/clients/${clientId}`);
        return true;
    }

    /**
     * Obtém estatísticas vitais do servidor.
     */
    async getSummaries(): Promise<any> {
        const res = await this.request('GET', '/v1/summaries');
        return res.data;
    }

    /**
     * Lista todas as streams ativas no servidor.
     */
    async getStreams(): Promise<any[]> {
        const res = await this.request('GET', '/v1/streams');
        return res.streams || []; // Ajuste conforme estrutura exata do SRS v5/v6
    }

    /**
     * Lista todos os clientes conectados.
     */
    async getClients(): Promise<any[]> {
        const res = await this.request('GET', '/v1/clients');
        return res.clients || [];
    }
}

export const srsService = new SrsService();
