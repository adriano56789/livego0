
import { Router } from 'express';
import { srsController } from '../controllers/srsController.js';
import { srsWebhookController } from '../controllers/srsWebhookController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// --- SRS HTTP API Proxy (Gerenciamento) ---
router.get('/v1/versions', srsController.getVersions);
router.get('/v1/summaries', srsController.getSummaries);
router.get('/v1/features', srsController.getFeatures);
router.get('/v1/clients', srsController.getClients);
router.get('/v1/clients/:id', srsController.getClientById);
router.get('/v1/streams', srsController.getStreams);
router.get('/v1/streams/:id', srsController.getStreamById);
router.delete('/v1/streams/:id', srsController.deleteStreamById);
router.get('/v1/connections', srsController.getConnections);
router.get('/v1/connections/:id', srsController.getConnectionById);
router.delete('/v1/connections/:id', srsController.deleteConnectionById);
router.get('/v1/configs', srsController.getConfigs);
router.put('/v1/configs', srsController.updateConfigs);
router.get('/v1/vhosts', srsController.getVhosts);
router.get('/v1/vhosts/:id', srsController.getVhostById);
router.get('/v1/requests', srsController.getRequests);
router.get('/v1/sessions', srsController.getSessions);
router.get('/v1/metrics', srsController.getMetrics);

// --- SRS WebRTC Signaling ---
router.post('/rtc/v1/publish', authMiddleware, srsController.rtcPublish);
router.post('/rtc/v1/play', authMiddleware, srsController.rtcPlay);
router.post('/rtc/v1/trickle/:sessionId', srsController.trickleIce);

// --- SRS Webhooks (Callbacks) ---
// Estas rotas devem ser configuradas no srs.conf na seção http_hooks
router.post('/srs/hooks/on_connect', srsWebhookController.onConnect);
router.post('/srs/hooks/on_close', srsWebhookController.onClose);
router.post('/srs/hooks/on_publish', srsWebhookController.onPublish);
router.post('/srs/hooks/on_unpublish', srsWebhookController.onUnpublish);
router.post('/srs/hooks/on_play', srsWebhookController.onPlay);
router.post('/srs/hooks/on_stop', srsWebhookController.onStop);
router.post('/srs/hooks/on_dvr', srsWebhookController.onDvr);

export default router;
