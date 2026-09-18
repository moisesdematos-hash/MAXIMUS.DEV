export class CronAgent {
  private tasks: Map<string, any> = new Map();

  /**
   * Identifica se a requisição do usuário exige o agendamento de uma tarefa recorrente.
   */
  public extractSchedule(request: string): { action: string, intervalMs: number, originalMatch: string } | null {
    // Regex para identificar padrões de tempo como "a cada X minutos", "todo segundo", etc.
    const match = request.match(/(?:a cada|every|todas as|todos os)\s+(\d+)?\s*(segundo|segundos|minuto|minutos|hora|horas)/i);
    
    if (!match) return null;

    let num = parseInt(match[1]) || 1; // se não tiver número, assume 1 (ex: "a cada minuto")
    const unit = match[2].toLowerCase();
    let intervalMs = num * 1000;

    if (unit.startsWith('minuto')) intervalMs = num * 60 * 1000;
    else if (unit.startsWith('hora')) intervalMs = num * 60 * 60 * 1000;

    const action = request.replace(match[0], '').replace(/(agende|monitore|verifique)/i, '').trim();

    return { action, intervalMs, originalMatch: match[0] };
  }

  /**
   * Agenda a execução de uma tarefa em background.
   */
  public scheduleTask(action: string, intervalMs: number, onExecute: (action: string) => Promise<void>): string {
    const taskId = `cron-${Date.now().toString().slice(-6)}`;
    console.log(`⏰ CronAgent: Tarefa [${taskId}] agendada a cada ${intervalMs}ms. Ação: "${action}"`);

    // Inicia o intervalo usando o timer do navegador
    const timer = setInterval(async () => {
      console.log(`⏰ CronAgent: Disparando execução de background [${taskId}]...`);
      try {
        await onExecute(action);
      } catch (e) {
        console.warn(`Erro na tarefa cron ${taskId}:`, e);
      }
    }, intervalMs);

    this.tasks.set(taskId, timer);
    return taskId;
  }

  /**
   * Cancela uma tarefa agendada
   */
  public clearTask(taskId: string) {
    const timer = this.tasks.get(taskId);
    if (timer) {
      clearInterval(timer);
      this.tasks.delete(taskId);
      console.log(`⏰ CronAgent: Tarefa [${taskId}] foi cancelada.`);
    }
  }

  public getActiveTasks() {
    return Array.from(this.tasks.keys());
  }
}
