# 📱 Community Events App

![React Native](https://img.shields.io/badge/React_Native-v0.73-blue.svg)
![Expo](https://img.shields.io/badge/Expo-v50+-black.svg)
![Firebase](https://img.shields.io/badge/Firebase-9.0+-yellow.svg)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)

Aplicación móvil desarrollada en **React Native (Expo)** con **TypeScript** para la gestión de eventos comunitarios. Permite a los vecinos organizar, difundir y participar en actividades locales de manera eficiente.

---

## 📋 Tabla de Contenidos
1. [Descripción y Funcionalidades](#-descripción-y-funcionalidades)
2. [Tecnologías](#-tecnologías)
3. [Metodología Scrum](#-metodología-scrum)

---

## 📖 Descripción y Funcionalidades

El objetivo del proyecto es fomentar la interacción social mediante una plataforma centralizada de eventos.

### Funcionalidades Principales
* **🔐 Autenticación:** Registro e inicio de sesión seguro (Firebase Auth).
* **📅 Gestión de Eventos (CRUD):**
    * **Crear:** Los usuarios pueden publicar nuevos eventos (Título, Ubicación, Fecha, Descripción).
    * **Leer:** Feed principal actualizado en tiempo real.
    * **Eliminar:** El creador de un evento puede eliminarlo si es necesario.
* **💬 Interacción Social:**
    * **RSVP:** Confirmación de asistencia (Asistir / Cancelar) con contador en tiempo real.
    * **Comentarios:** Chat integrado en cada evento.
    * **Compartir:** Integración con apps nativas (WhatsApp, Telegram, etc.) para difundir el evento.
* **👤 Perfil:** Historial de eventos creados y sesión de usuario.

---

## 🛠 Tecnologías

* **Frontend:** React Native, Expo Router, TypeScript.
* **Estilos:** StyleSheet nativo, Expo Vector Icons.
* **Backend (BaaS):** Firebase (Firestore Database & Authentication).
* **Compilación:** EAS (Expo Application Services).

---

## 👥 Metodología Scrum

El desarrollo se realizó bajo la metodología ágil Scrum con los siguientes roles asignados:

| Rol | Integrante | Responsabilidades |
| :--- | :--- | :--- |
| **Product Owner** | Ernesto González | Definición de Historias de Usuario y validación de requisitos. |
| **Scrum Master** | Ernesto González | Gestión del tablero Kanban y resolución de bloqueos técnicos (WSL/Android). |
| **Dev Team** | Ernesto González | Codificación en React Native, lógica de negocios e integración Firebase. |

---
