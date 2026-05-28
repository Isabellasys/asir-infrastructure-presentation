ASIR Infrastructure Presentation
🚀 Descripción del Proyecto
Documentación interactiva y arquitectónica del proyecto final del Grado Superior ASIR (Administración de Sistemas Informáticos en Red). Este repositorio contiene los recursos visuales y técnicos que explican la arquitectura de red híbrida y los flujos de automatización implementados en el proyecto HORSEBIT.

🛠️ Stack Tecnológico
Frontend: HTML5, CSS3, JavaScript.

Infraestructura Base: Proxmox (Virtualización), Azure (Cloud Computing).

Automatización & GitOps: Pipeline CI/CD automatizado mediante GitHub y Netlify.

⚡ Automatización (CI/CD Pipeline)
Este proyecto cuenta con un flujo de despliegue automatizado. Cada vez que se realiza un push a la rama master, se ejecutan las siguientes acciones:

Webhook Trigger: GitHub notifica a Netlify sobre el nuevo código.

Build Process: El sistema detecta y compila los archivos estáticos.

Global Edge Deployment: El sitio se despliega automáticamente en una red global (CDN) en milisegundos.

🌐 Enlace de Producción
Puedes ver la presentación interactiva en tiempo real aquí:
👉 https://asir-infrastructure-presentation.netlify.app
