const { createApp } = Vue;

createApp({
    data() {
        return {
            regions: [], // This will hold the list of regions
            selectedRegion: "" // Stores the selected region
        };
    },
    methods: {
        // Mock API call or logic to populate the regions list
        fetchRegions() {
            // Replace with actual logic/API call to fetch regions
            this.regions = ['North America', 'Europe', 'Asia', 'Africa', 'Oceania', 'South America']; // Replace with real region data
        },
        // Submit button handler
        submitRegion() {
            if (this.selectedRegion) {
                alert(`Selected region: ${this.selectedRegion}`);
                // Place additional submit logic here (e.g., POST request)
            } else {
                alert("Please select a region before submitting.");
            }
        }
    },
    mounted() {
        // Fetch regions when the component is mounted
        this.fetchRegions();
    }
}).mount('#app');