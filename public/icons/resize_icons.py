from PIL import Image
import os

def resize_icons(input_dir, output_dir, size=(180, 180)):
    # 출력 디렉토리가 없으면 생성
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 입력 디렉토리 내의 모든 폴더 순회
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith('.png'):
                # 입력 파일의 전체 경로
                input_path = os.path.join(root, file)
                
                # 출력 파일의 상대 경로 계산
                rel_path = os.path.relpath(root, input_dir)
                output_subdir = os.path.join(output_dir, rel_path)
                
                # 출력 서브디렉토리가 없으면 생성
                if not os.path.exists(output_subdir):
                    os.makedirs(output_subdir)
                
                # 출력 파일의 전체 경로
                output_path = os.path.join(output_subdir, file)
                
                try:
                    # 이미지 열기
                    with Image.open(input_path) as img:
                        # 이미지 리사이징 (고품질)
                        resized_img = img.resize(size, Image.Resampling.LANCZOS)
                        # 리사이즈된 이미지 저장
                        resized_img.save(output_path, 'PNG')
                    print(f'리사이징 완료: {input_path} -> {output_path}')
                except Exception as e:
                    print(f'에러 발생 ({input_path}): {str(e)}')

if __name__ == '__main__':
    # 현재 디렉토리의 상대 경로 기준
    input_directory = '.'  # 현재 icons 폴더
    output_directory = '../resized_icons'  # 상위 폴더에 resized_icons 생성
    
    print('이미지 리사이징 시작...')
    resize_icons(input_directory, output_directory)
    print('이미지 리사이징 완료!') 