import sys
import re

file_path = "src/lib/multiAgentSystem.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add properties
props_old = """  private securityAgent: SecurityAgent;
  private collaborationAgent: CollaborationAgent;"""
props_new = """  private securityAgent: SecurityAgent;
  private collaborationAgent: CollaborationAgent;
  private researchAgent: ResearchAgent;
  private databaseAgent: DatabaseAgent;
  private grepAgent: GrepAgent;
  private cronAgent: CronAgent;
  private ingestionAgent: IngestionAgent;"""

content = content.replace(props_old, props_new)

# Add instantiations
init_old = """    this.blueprintAgent = new BlueprintAgent();
    this.securityAgent = new SecurityAgent();
    this.collaborationAgent = collaborationAgent;
  }"""
init_new = """    this.blueprintAgent = new BlueprintAgent();
    this.securityAgent = new SecurityAgent();
    this.collaborationAgent = collaborationAgent;
    this.researchAgent = new ResearchAgent();
    this.databaseAgent = new DatabaseAgent();
    this.grepAgent = new GrepAgent();
    this.cronAgent = new CronAgent();
    this.ingestionAgent = new IngestionAgent();
  }"""

content = content.replace(init_old, init_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import os
os.system("git add src/lib/multiAgentSystem.ts")
os.system('git commit -m "fix: initialize missing agents in MultiAgentOrchestrator"')
os.system("git push origin master")
print("Fixed missing agents in MultiAgentOrchestrator")
