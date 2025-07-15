import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      '0fd8-2a01-e0a-447-e380-f8f8-bc64-bf66-3d8c.ngrok-free.app',
      'b19a-2a01-e0a-447-e380-f8f8-bc64-bf66-3d8c.ngrok-free.app',
      '3b62-2a01-e0a-447-e380-fcea-b98f-b585-3887.ngrok-free.app'
    ],
    host: true
  }
}); 