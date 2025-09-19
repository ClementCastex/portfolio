/**
 * Service de logging sécurisé pour la production
 * Remplace les console.log par un système plus robuste
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Limiter pour éviter les fuites mémoire

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry('debug', message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.log(`🔍 [DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.info(`ℹ️ [INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, data);
    } else {
      // En production, on peut envoyer à un service de monitoring
      this.sendToMonitoring(entry);
    }
  }

  error(message: string, error?: any) {
    const entry = this.createLogEntry('error', message, {
      error: error?.message || error,
      stack: error?.stack,
      ...error
    });
    this.addLog(entry);

    // Toujours afficher les erreurs
    console.error(`❌ [ERROR] ${message}`, error);

    // En production, envoyer à un service de monitoring
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // Exemple: envoyer à Sentry, LogRocket, ou votre propre API
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (err) {
      // Éviter les boucles infinies d'erreurs
      console.error('Failed to send log to monitoring:', err);
    }
  }

  // Obtenir les logs récents pour le debugging
  getRecentLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Nettoyer les logs (utile pour les tests)
  clearLogs() {
    this.logs = [];
  }
}

// Instance singleton
export const logger = new Logger();

// Export par défaut pour faciliter l'utilisation
export default logger;
