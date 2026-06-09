# Usa a imagem leve do Nginx
from nginx:alpine

# Copia o conteúdo da pasta public para a pasta onde o Nginx serve arquivos
copy public /usr/share/nginx/html

# O Nginx usa a porta 80 por padrão
expose 80