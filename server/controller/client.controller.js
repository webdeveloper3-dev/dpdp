/**
 * Client Management Controller
 */

const clientService = require("../services/client.service");

class ClientController {
  async getAll(req, res, next) {
    try {
      const clients = await clientService.getAllClients();
      return res.json({ success: true, count: clients.length, clients });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { tenantId } = req.params;
      const result = await clientService.getClientById(tenantId);
      if (!result) {
        return res.status(404).json({ success: false, message: "Client not found" });
      }
      return res.json({
        success: true,
        client: result.client,
        stats: result.stats
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { clientName } = req.body;
      if (!clientName) {
        return res.status(400).json({ success: false, message: "Client Name is required" });
      }
      const record = await clientService.createClient(req.body);
      return res.status(201).json({
        success: true,
        message: "Enterprise Client onboarded to DPDP Compliance Engine",
        client: record
      });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const { tenantId } = req.params;
      await clientService.deleteClient(tenantId);
      return res.json({ success: true, message: `Client ${tenantId} decommissioned` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ClientController();
