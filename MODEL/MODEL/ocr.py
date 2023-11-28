from PIL import Image
import pyocr
import pyocr.builders
import sys
import os

os.environ["TESSDATA_PREFIX"] = "D:/MODEL/dataset"

tools = pyocr.get_available_tools()

if len(tools) == 0:
    print('Không thể sử dụng công cụ OCR')
    sys.exit(1)

tool = tools[0]

langs = tool.get_available_languages()

image_path = sys.argv[1]

txt = tool.image_to_string(
    Image.open(image_path),  
    lang='jpn',
    builder=pyocr.builders.TextBuilder(tesseract_layout=11)  
)
# print('\n\nOCR Kết quả thực thi (nhận dạng ký tự quang học)\n\n\n__________________\n\n', txt, '\n\n__________________\n\n')
# Chuyển đổi văn bản thành chuỗi UTF-8 trước khi in ra
# print('fthgja0nkkkmkmakmkma')
sys.stdout.buffer.write(txt.encode('utf-8'))
sys.stdout.flush()
