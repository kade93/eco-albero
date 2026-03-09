
import zipfile
import xml.etree.ElementTree as ET
import json

def get_xlsx_data(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        # Read shared strings
        strings_xml = z.read('xl/sharedStrings.xml')
        strings_root = ET.fromstring(strings_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        shared_strings = []
        for si in strings_root.findall('ns:si', ns):
            t = si.find('ns:t', ns)
            if t is not None:
                shared_strings.append(t.text)
            else:
                # Handle formatted text
                r_texts = si.findall('.//ns:t', ns)
                shared_strings.append("".join([r.text for r in r_texts if r.text]))
        
        # Read sheet1
        sheet_xml = z.read('xl/worksheets/sheet1.xml')
        sheet_root = ET.fromstring(sheet_xml)
        
        rows = []
        for row in sheet_root.findall('.//ns:row', ns):
            current_row = []
            for cell in row.findall('ns:c', ns):
                value_elem = cell.find('ns:v', ns)
                if value_elem is not None:
                    value = value_elem.text
                    cell_type = cell.get('t')
                    if cell_type == 's':
                        current_row.append(shared_strings[int(value)])
                    else:
                        current_row.append(value)
                else:
                    current_row.append(None)
            rows.append(current_row)
            
    # Process into map
    area_map = {}
    # Header is at index 1 (second row)
    # ['필지', '부지면적', '도로(공용)면적', '분양면적', '평형', '단가(원)', '평가액(원)']
    for row in rows[2:]:
        if len(row) >= 4:
            plot_id = row[0]
            sale_area = row[3] # 분양면적
            if plot_id and sale_area:
                # Clean up plot_id if needed, and format sale_area
                area_map[plot_id] = round(float(sale_area), 1)
                
    return area_map

if __name__ == "__main__":
    file_path = '/Users/kade93/workspaces/eco-albero/에코알베로_필지별_전필지_작업.xlsx'
    data = get_xlsx_data(file_path)
    print(json.dumps(data, ensure_ascii=False, indent=2))
