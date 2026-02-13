import { SettingModel } from '../models/Setting';
import { connectDB } from '../database';

export interface TurnServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
  credentialType?: string;
}

class TurnConfigService {
  private static readonly TURN_CONFIG_KEY = 'turn_server_config';
  private static isDbConnected = false;

  private static async ensureDbConnection() {
    if (!this.isDbConnected) {
      await connectDB();
      this.isDbConnected = true;
    }
  }

  static async getTurnConfig(): Promise<TurnServerConfig[]> {
    try {
      await this.ensureDbConnection();
      const config = await SettingModel.findOne({ key: this.TURN_CONFIG_KEY }).lean();
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
      // Return default config if there's an error
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
    }
  }

  static async saveTurnConfig(config: TurnServerConfig[]): Promise<void> {
    try {
      await this.ensureDbConnection();
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
