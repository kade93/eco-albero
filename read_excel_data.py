
import zipfile
import xml.etree.ElementTree as ET
import os

def read_xlsx_simple(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        # Read shared strings
        strings_xml = z.read('xl/sharedStrings.xml')
        strings_root = ET.fromstring(strings_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        shared_strings = [t.text for t in strings_root.findall('.//ns:t', ns)]
        
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
        return rows

if __name__ == "__main__":
    file_path = '/Users/kade93/workspaces/eco-albero/에코알베로_필지별_전필지_작업.xlsx'
    data = read_xlsx_simple(file_path)
    for row in data:
        print(row)
