import os

def generate_tree(dir_path, exclude_dirs, exclude_files):
    tree_str = f"{os.path.basename(dir_path)}/\n"
    for root, dirs, files in os.walk(dir_path):
        dirs.sort()
        files.sort()
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        level = root.replace(dir_path, '').count(os.sep)
        
        if root != dir_path:
            indent = '│   ' * level + '├── '
            tree_str += f"{indent}{os.path.basename(root)}/\n"
            subindent = '│   ' * (level + 1) + '├── '
        else:
            subindent = '├── '
            
        for f in files:
            if any(f.endswith(ext) for ext in exclude_files) or f in exclude_files:
                continue
            tree_str += f"{subindent}{f}\n"
    return tree_str

if __name__ == "__main__":
    b_tree = generate_tree('backend', ['venv', '.venv', 'env', '__pycache__', '.git', 'migrations', 'media'], ['.pyc', '.DS_Store'])
    f_tree = generate_tree('frontend', ['node_modules', '.git', 'dist'], ['.DS_Store'])
    with open('tree.txt', 'w', encoding='utf-8') as f:
        f.write("=== BACKEND ===\n")
        f.write(b_tree)
        f.write("=== FRONTEND ===\n")
        f.write(f_tree)
