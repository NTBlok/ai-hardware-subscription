# Hardware Subscription Platform

A comprehensive platform for managing hardware subscriptions, tracking physical devices, and providing customer support. The system allows customers to report hardware issues, track device status, and receive AI-powered assistance for troubleshooting.

## Key Features

- **Device Management**: Track all hardware devices and their status
- **Issue Reporting**: Report and monitor hardware issues in real-time
- **Subscription Tracking**: Manage customer subscriptions and device allocations
- **AI-Powered Support**: Coming soon - AI assistant for automated issue triage and customer support
- **Analytics Dashboard**: Monitor device health and subscription metrics

## Tech Stack

- **Frontend**: Next.js with TypeScript, Material-UI
- **Backend**: Python Flask with SQLAlchemy
- **Database**: SQLite (with PostgreSQL support available)
- **AI/ML**: Integration with OpenAI for AI assistance (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (3.8+)
- npm or yarn

### API Setup

```sh
cd api/
python3 -m venv venv
source venv/bin/activate 
pip install --requirement requirements.txt
python app.py