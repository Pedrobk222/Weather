# Projeto: Weather App Brasil

## Autor

Pedro Henrique Bortolucci Klayn

## Descrição do Projeto

Weather App Brasil é uma aplicação web desenvolvida para fornecer informações detalhadas sobre o clima de diversas cidades do Brasil e capitais do mundo. A aplicação oferece previsões diárias e horárias, além de exibir dados relevantes como temperatura, umidade, velocidade do vento, e mais. Também inclui um mapa interativo que mostra a localização da cidade pesquisada. As previsões são atualizadas a cada 5 minutos, e caso a temperatura ultrapasse 30°C e o vento passe de 50 km/h ele gera alertas para o usuário.

## Funcionalidades

- **Previsão do Tempo**: Obtenha a previsão do tempo atual, incluindo temperatura, umidade, velocidade do vento, índice UV, e mais.
- **Previsão Diária e Horária**: Veja a previsão do tempo para os próximos dias e para as próximas horas.
- **Mapa Interativo**: Visualize a localização da cidade pesquisada em um mapa interativo.
- **Alertas de Clima**: Receba alertas sobre condições climáticas extremas, como altas temperaturas e ventanias.
- **Clima das Capitais**: Acesse rapidamente informações climáticas e hora das principais capitais do mundo.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **React-Select**: Componente para seleção assíncrona de cidades.
- **Leaflet**: Biblioteca JavaScript para mapas interativos.
- **Chart.js**: Biblioteca JavaScript para criação de gráficos.
- **Axios**: Cliente HTTP para fazer requisições à API do tempo.
- **Moment.js**: Biblioteca para manipulação de datas e horários.
- **WeatherAPI**: API utilizada para obter dados climáticos.
- **OpenStreetMap**: Utilizado para a exibição do mapa interativo.
- **Nominatim API**: Serviço de geocodificação para obter coordenadas de cidades.

### APIs Utilizadas

- WeatherAPI: A WeatherAPI é utilizada para fornecer dados climáticos detalhados, incluindo previsões diárias e horárias. Através desta API, a aplicação obtém informações como temperatura atual, máxima e mínima, umidade, velocidade do vento, índice UV, condições climáticas e horários de nascer e pôr do sol.
- Nominatim API: Quando o usuário digita o nome de uma cidade, a Nominatim API é chamada para encontrar as coordenadas correspondentes. As coordenadas retornadas são então usadas para fazer uma chamada à WeatherAPI e obter os dados climáticos para a localização especificada.

## Instalação e Execução

### Pré-requisitos

- Node.js instalado
- NPM ou Yarn

### Passos para Executar

1. Baixe o repositório:

- https://github.com/Pedrobk222/Weather.git

2. Navegue até o diretório:

- Weather/weather-app$

3. Execute os comandos:

- npm install
- npm start

4. Acesse a aplicação em seu navegador:

- http://localhost:3000

### Estrutura do Projeto

- src/pages/Home.js: Página principal da aplicação, onde o usuário pode pesquisar por cidades e ver a previsão do tempo.
- src/pages/Capitals.js: Página que exibe a previsão do tempo das capitais do mundo.
- src/services/nominatimService.js: Serviço para obter coordenadas de cidades usando Nominatim.
- src/services/timeService.js: Serviço para obter o horário local das capitais.
- src/components/WeatherConditionTranslator.js: Componente para traduzir as condições climáticas.
- src/App.css: Estilização da página.




   
   
