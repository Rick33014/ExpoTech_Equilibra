import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Dados de Treino (Simulando um Dataset de Nutricionistas)
# Formato: [Peso (kg), Altura (cm)]
X_train = np.array([
    [50, 150], [60, 160], [65, 165], [70, 170], 
    [75, 175], [80, 180], [90, 180], [100, 185], 
    [110, 190], [55, 160]
])

# Meta Calórica recomendada para esses perfis (Dados supervisionados)
y_train = np.array([
    1800, 2000, 2150, 2300, 
    2450, 2600, 2800, 3000, 
    3200, 1900
])

# 2. Treinar o Modelo (Machine Learning acontece aqui)
model = LinearRegression()
model.fit(X_train, y_train)

def predict():
    try:
        # 3. Receber dados do Node.js (vem como string JSON no argumento)
        # sys.argv[1] é o primeiro argumento passado pelo comando
        input_json = sys.argv[1]
        data = json.loads(input_json)
        
        peso = float(data['weight'])
        altura = float(data['height'])

        # 4. Fazer a Previsão
        user_features = np.array([[peso, altura]])
        prediction = model.predict(user_features)

        # 5. Retornar o resultado (Imprimir JSON para o Node ler)
        result = {
            "status": "success",
            "predicted_calories": round(prediction[0], 0),
            "message": "Cálculo realizado via modelo de Regressão Linear (Scikit-Learn)"
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    predict()"" 
