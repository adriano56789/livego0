import { SettingModel } from '../models/Setting';

export interface TurnServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
  credentialType?: string;
}

class TurnConfigService {
  private static readonly TURN_CONFIG_KEY = 'turn_server_config';

  static async getTurnConfig(): Promise<TurnServerConfig[]> {
    try {
      const config = await SettingModel.findOne({ key: this.TURN_CONFIG_KEY });
      if (config?.value) {
        return config.value as TurnServerConfig[];
      }
      // Retorna configuração padrão se não encontrar no banco
      return [
        {
          urls: 'stun:72.60.249.175:3478',
          username: 'livego',
          credential: 'adriano123',
          credentialType: 'password'
        },
        {
          urls: 'turn:72.60.249.175:3478',
          username: 'livego',
          credential: 'adriano123',
          credentialType: 'password'
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar configuração TURN:', error);
      throw error;
    }
  }

  static async saveTurnConfig(config: TurnServerConfig[]): Promise<void> {
    try {
      await SettingModel.findOneAndUpdate(
        { key: this.TURN_CONFIG_KEY },
        { 
          key: this.TURN_CONFIG_KEY,
          value: config 
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Erro ao salvar configuração TURN:', error);
      throw error;
    }
  }
}

export default TurnConfigService;
