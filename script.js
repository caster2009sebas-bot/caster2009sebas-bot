// Lógica principal de la calculadora de propinas en 3 pasos: Calcular -> Pagar -> Modal

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const amountInput = document.getElementById('amount');
    const calculateButton = document.getElementById('calculateButton');
    const payButton = document.getElementById('payButton');
    const resultContainer = document.getElementById('resultContainer');
    const successModal = document.getElementById('successModal');
    const modalContent = document.getElementById('modalContent');
    
    // Variable para almacenar el total calculado antes de pagar
    let currentTotal = 0;

    // --- Funciones del Modal ---

    /**
     * Muestra la ventana modal con animación.
     */
    window.showSuccessModal = () => {
        successModal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('opacity-0', 'scale-95');
            modalContent.classList.add('opacity-100', 'scale-100');
        }, 10);
    };

    /**
     * Oculta la ventana modal con animación y reinicia el estado de la aplicación.
     */
    window.hideSuccessModal = () => {
        modalContent.classList.remove('opacity-100', 'scale-100');
        modalContent.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            successModal.classList.add('hidden');
            resetState(); // Reiniciar la UI después de cerrar la modal
        }, 300); // Coincide con la duración de la transición CSS
    };
    
    /**
     * Función para reiniciar la UI a su estado inicial.
     */
    const resetState = () => {
        amountInput.value = '';
        calculateButton.style.display = 'block';
        payButton.style.display = 'none';
        currentTotal = 0;
        resultContainer.innerHTML = `
            <p class="text-gray-300 text-lg">
                Los detalles de la transacción aparecerán aquí después del cálculo.
            </p>
            <p class="text-xs text-gray-500 mt-2">(Propina Fija: 10%)</p>
        `;
    };

    // Asegurarse de que el estado inicial sea correcto al cargar la página
    resetState();

    // --- PASO 2: Calcular Propina (Botón 'Calcular') ---
    calculateButton.addEventListener('click', async function() {
        // Validación del monto
        const amount = parseFloat(amountInput.value);
        
        if (isNaN(amount) || amount <= 0) {
            resultContainer.innerHTML = '<div class="p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg text-center font-medium">Por favor, ingresa un monto válido.</div>';
            payButton.style.display = 'none';
            return;
        }

        // Mostrar estado de carga
        resultContainer.innerHTML = '<div class="flex justify-center items-center p-4 text-gray-300"><svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Calculando...</div>';

        try {
            const tipRate = 0.10; // 10%
            const tipAmount = amount * tipRate;
            const totalAmount = amount + tipAmount;
            currentTotal = totalAmount; // Almacenar el total para el paso de pago

            const tipDisplay = tipAmount.toFixed(2);
            const totalDisplay = totalAmount.toFixed(2);
            const amountDisplay = amount.toFixed(2);

            // Esperamos un momento para que se vea el "Calculando..."
            await new Promise(resolve => setTimeout(resolve, 500)); 

            // Estructura de resultados
            resultContainer.innerHTML = `
                <div class="p-5 bg-cyan-900 border-l-4 border-cyan-700 rounded-lg shadow-2xl text-left">
                    <p class="text-2xl font-bold text-cyan-300 mb-2">Resumen de Propina</p>
                    <hr class="border-gray-700 mb-3" />
                    
                    <div class="space-y-2 text-gray-200">
                        <p class="flex justify-between">
                            Monto Original: 
                            <span class="font-semibold text-white">$${amountDisplay}</span>
                        </p>
                        <p class="flex justify-between">
                            Propina (10%): 
                            <span class="font-semibold text-cyan-400">$${tipDisplay}</span>
                        </p>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                        <p class="text-xl font-extrabold text-white">Total a Pagar:</p> 
                        <p class="text-3xl font-extrabold text-cyan-400">$${totalDisplay}</p>
                    </div>
                </div>
                <div class="mt-6 p-4 bg-gray-700 rounded-lg text-center font-medium text-gray-200 shadow-md">
                    Presiona 'Pagar Total' para finalizar la transacción.
                </div>
            `;
            
            // PASO 3: Ocultar Calcular y Mostrar Pagar
            calculateButton.style.display = 'none';
            payButton.style.display = 'block';

        } catch (error) {
            console.error('Error al calcular:', error);
            resultContainer.innerHTML = `
                <div class="p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg text-center font-medium">
                    Error interno al realizar el cálculo.
                </div>
            `;
            // Si hay error, volvemos a mostrar solo el botón de calcular
            payButton.style.display = 'none';
            calculateButton.style.display = 'block';
        }

    });

    // --- PASO 4: Pagar Total (Muestra la Modal 'Pago Exitoso') ---
    payButton.addEventListener('click', function() {
        if (currentTotal > 0) {
            showSuccessModal();
        } else {
            // Si se presiona pagar sin calcular (medida de seguridad)
            resultContainer.innerHTML = '<div class="p-4 bg-red-900 border border-red-700 text-red-300 rounded-lg text-center font-medium">Por favor, calcula el monto primero.</div>';
            payButton.style.display = 'none';
            calculateButton.style.display = 'block';
        }
    });
});