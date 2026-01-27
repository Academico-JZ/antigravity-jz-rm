import os
import shutil
import urllib.request
import zipfile
import tempfile

def sync_kit(repo_url, kit_name):
    print(f"🔄 Sincronizando {kit_name} desde {repo_url}...")
    
    # Resolvendo o root do projeto dinamicamente
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, "..", ".."))
    agent_dir = os.path.join(project_root, ".agent")
    
    # Try common branch names
    branches = ["main", "master"]
    success = False
    active_branch = None
    
    # Robust URL cleaning
    base_url = repo_url
    if base_url.endswith(".git"):
        base_url = base_url[:-4]
    
    with tempfile.TemporaryDirectory() as temp_dir:
        for branch in branches:
            temp_zip = os.path.join(temp_dir, f"{branch}.zip")
            zip_url = f"{base_url}/archive/refs/heads/{branch}.zip"
            
            try:
                print(f"  -> Tentando branch '{branch}' em {zip_url}...")
                # User-Agent é opcional mas ajuda a evitar bloqueios simples
                req = urllib.request.Request(zip_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response, open(temp_zip, 'wb') as out_file:
                    out_file.write(response.read())
                
                success = True
                active_branch = branch
                break
            except Exception:
                continue
        
        if not success:
            print(f"  ❌ Erro: Não foi possível baixar {kit_name} (tentado main e master)")
            return

        # Extract
        try:
            with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
        except Exception as e:
            print(f"  ❌ Erro ao extrair {kit_name}: {e}")
            return

        # Folder is usually [repo-name]-[branch]
        extracted_content = os.listdir(temp_dir)
        extracted_folder = None
        for item in extracted_content:
            if os.path.isdir(os.path.join(temp_dir, item)) and item != "__MACOSX":
                extracted_folder = os.path.join(temp_dir, item)
                break
        
        if not extracted_folder:
            print(f"  ❌ Pasta extraída não encontrada para {kit_name}")
            return

        # Sync folders
        sub_folders = ["agents", "skills", "workflows", "scripts"]
        for sub in sub_folders:
            src = os.path.join(extracted_folder, ".agent", sub)
            dest = os.path.join(agent_dir, sub)
            
            if os.path.exists(src):
                print(f"  -> Atualizando {sub}...")
                if not os.path.exists(dest):
                    os.makedirs(dest)
                
                # Copy contents
                for item in os.listdir(src):
                    s = os.path.join(src, item)
                    d = os.path.join(dest, item)
                    try:
                        if os.path.isdir(s):
                            shutil.rmtree(d, ignore_errors=True)
                            shutil.copytree(s, d)
                        else:
                            shutil.copy2(s, d)
                    except Exception as e:
                        print(f"     ⚠️ Erro ao copiar {item}: {e}")

    print(f"✅ Sincronização de {kit_name} (branch: {active_branch}) concluída!")

if __name__ == "__main__":
    sync_kit("https://github.com/sickn33/antigravity-awesome-skills.git", "Awesome Skills")
    sync_kit("https://github.com/vudovn/antigravity-kit.git", "Antigravity Kit")
    print("\n✨ Todos os kits foram sincronizados com sucesso!")
