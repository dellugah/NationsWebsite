const app = Vue.createApp({
    data() {
        return {
            // Data model for the form inputs
            city: {
                cityName: '',
                population: null,
                province: '',
                country: ''
            },
            message: '', // Success message
            error: ''    // Error message
        };
    },
    methods: {
        async submitCity() {
            this.message = '';
            this.error = '';
            try {
                // POST request to the Spring Boot backend
                const response = await fetch('http://localhost:8080/api/city', { // Replace with your own backend URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.city)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Response from server:', data);
                    this.message = 'City information submitted successfully!';
                    this.resetForm(); // Clear the form after successful submission
                } else {
                    const errorText = await response.text();
                    this.error = `Failed to submit city information. Error: ${errorText}`;
                    console.error('Error:', errorText);
                }
            } catch (err) {
                this.error = 'An error occurred while submitting the form. Please check your network connection.';
                console.error('Error:', err);
            }
        },
        resetForm() {
            this.city = {
                cityName: '',
                population: null,
                province: '',
                country: ''
            };
        }
    }
});

app.mount('#app');