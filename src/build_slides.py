import json
import os
import sys

def build_slides(episode_dir):
    source_path = os.path.join(episode_dir, "草稿1.md")
    # もし 草稿1.md がなければ フォルダ内の唯一の .md を探す
    if not os.path.exists(source_path):
        md_files = [f for f in os.listdir(episode_dir) if f.endswith('.md')]
        if md_files:
            source_path = os.path.join(episode_dir, md_files[0])
        else:
            print(f"Error: No .md manuscript found in {episode_dir}")
            return

    manifest_path = os.path.join(episode_dir, "manifest.json")
    output_path = os.path.join(episode_dir, "slides.js")

    if not os.path.exists(manifest_path):
        print(f"Error: {manifest_path} not found.")
        return

    # Load Manifest
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    # Load Source File
    with open(source_path, 'r', encoding='utf-8') as f:
        source_lines = f.readlines()

    final_slides = []
    for entry in manifest.get('slides', []):
        line_range = entry.get('range')
        if not line_range or len(line_range) != 2:
            continue
        
        start_line = line_range[0]
        end_line = line_range[1]
        selected_lines = source_lines[start_line-1 : end_line]
        verbatim_script = "".join(selected_lines).strip()

        slide = {
            "title": entry.get("title", ""),
            "content": entry.get("content", ""),
            "imgDesc": entry.get("imgDesc", ""),
            "script": verbatim_script
        }
        
        # もし画像が既にある場合はそれを使う設定（将来用）
        # imageSrc はフォルダ相対パスで管理
        img_filename = entry.get("imageSrc", "")
        if img_filename:
            slide["imageSrc"] = img_filename
        
        final_slides.append(slide)

    # Write slides.js
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("/**\n * HYBRID BUILD: AI Design + Algorithmic Verbatim Transfer\n")
        f.write(" * Source: " + os.path.basename(source_path) + "\n")
        f.write(" */\n")
        f.write("const slidesData = ")
        json.dump(final_slides, f, ensure_ascii=False, indent=4)
        f.write(";")

    print(f"Success: Built {len(final_slides)} slides in {output_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        # 引数がない場合は、現在の直下の episodes から選択するなどの簡易対話を想定
        episodes_dir = "episodes"
        if not os.path.exists(episodes_dir):
            episodes_dir = "../episodes" # srcから実行する場合

        available = sorted([d for d in os.listdir(episodes_dir) if os.path.isdir(os.path.join(episodes_dir, d))])
        
        if not available:
            print("No episodes found in episodes/ directory.")
            sys.exit(1)
            
        print("Available Episodes:")
        for i, name in enumerate(available):
            print(f"[{i}] {name}")
        
        idx = input("Select episode index to build: ")
        try:
            target_dir = os.path.join(episodes_dir, available[int(idx)])
        except:
            print("Invalid selection.")
            sys.exit(1)

    build_slides(target_dir)
