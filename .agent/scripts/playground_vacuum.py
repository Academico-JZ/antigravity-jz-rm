#!/usr/bin/env python3
"""
Playground Vacuum - Antigravity JZ-RM
====================================
Scans the entire playground and modularly links all workspaces
that lack the .agent controller. Zero-touch orchestration.
"""

import os
import sys
from pathlib import Path
import subprocess

def get_script_path():
    home = Path.home()
    return home / ".gemini" / "antigravity" / "kit" / "scripts" / "workspace_linker.py"

def vacuum_playground():
    # Detect Playground Root (Assuming standard structure)
    current_script_dir = Path(__file__).resolve().parent
    # Expected: ~/.gemini/antigravity/kit/scripts/playground_vacuum.py
    
    # We'll use a safer way: detect the parent of the folder where the user has their projects
    # Based on the user's current CWD: c:\Users\zalon\.gemini\antigravity\playground\azure-pathfinder
    playground_root = Path(r"c:\Users\zalon\.gemini\antigravity\playground")
    
    if not playground_root.exists():
        print(f"❌ Error: Playground root not found at {playground_root}")
        return

    linker_script = get_script_path()
    if not linker_script.exists():
        print(f"❌ Error: Linker script not found at {linker_script}")
        return

    print(f"🌌 Starting Playground Vacuum Sweep: {playground_root}\n")
    
    workspaces = [d for d in playground_root.iterdir() if d.is_dir()]
    linked_count = 0

    for ws in workspaces:
        if ws.name == "antigravity-kit" or ws.name == "antigravity-jz-rm":
            continue
            
        agent_dir = ws / ".agent"
        if not agent_dir.exists():
            print(f"🌀 Linking workspace: {ws.name}")
            try:
                subprocess.run([sys.executable, str(linker_script), str(ws)], capture_output=True)
                linked_count += 1
            except Exception as e:
                print(f" [!] Failed to link {ws.name}: {e}")
        else:
            print(f"✅ Workspace already linked: {ws.name}")

    print(f"\n✨ Sweep Complete. {linked_count} new workspaces provisioned.")

if __name__ == "__main__":
    vacuum_playground()
