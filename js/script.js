
// Enhanced TransitTracker Application - Complete Implementation
const TransitTracker = {
    // Application state
    state: {
        userLocation: null,
        isLocationEnabled: false,
        isTrackingEnabled: false,
        nearbyTransport: [],
        schedules: [],
        prices: [],
        busStops: [],
        interStateRoutes: [],
        interCityRoutes: [],
        scheduledTrips: [],
        currentTrips: [],
        previousTrips: [],
        selectedTransportDetails: null,
        activeModal: null,
        activeTab: null,
        currentTransportOptions: []
    },

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.setupAnimations();
        this.initializeSampleData();
        this.addNotificationStyles();
        console.log('TransitTracker initialized successfully with all features');
    },

    // Setup all event listeners
    setupEventListeners() {
        // Location permission button
        const locationBtn = document.getElementById('locationBtn');
        if (locationBtn) {
            locationBtn.addEventListener('click', this.requestLocation.bind(this));
        }

        // Journey planner
        this.setupJourneyPlanner();

        // Transport category cards
        this.setupTransportCategories();

        // Quick action cards
        this.setupActionCards();
        
        // Modal controls
        this.setupModals();
        
        // Search functionality
        this.setupSearch();
        
        // Toggle switch
        this.setupToggleSwitch();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    },

    // Setup journey planner functionality
    setupJourneyPlanner() {
        // GPS button for current location
        const useCurrentGPS = document.getElementById('useCurrentGPS');
        if (useCurrentGPS) {
            useCurrentGPS.addEventListener('click', this.useCurrentLocationForJourney.bind(this));
        }

        // Swap locations button
        const swapLocations = document.getElementById('swapLocations');
        if (swapLocations) {
            swapLocations.addEventListener('click', this.swapJourneyLocations.bind(this));
        }

        // Time preference radio buttons
        const timePreferences = document.querySelectorAll('input[name="timeType"]');
        timePreferences.forEach(radio => {
            radio.addEventListener('change', this.handleTimePreferenceChange.bind(this));
        });

        // Search routes button
        const searchRoutesBtn = document.getElementById('searchRoutes');
        if (searchRoutesBtn) {
            searchRoutesBtn.addEventListener('click', this.searchTransportRoutes.bind(this));
        }

        // Favorites button
        const favoritesBtn = document.getElementById('showFavorites');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', this.showFavoriteDestinations.bind(this));
        }
    },

    // Setup transport category cards
    setupTransportCategories() {
        // Inter-state travel
        const interStateCard = document.getElementById('interStateCard');
        if (interStateCard) {
            interStateCard.addEventListener('click', () => {
                this.openModal('interStateModal');
                this.loadInterStateRoutes();
            });
        }

        // Inter-city travel
        const interCityCard = document.getElementById('interCityCard');
        if (interCityCard) {
            interCityCard.addEventListener('click', () => {
                this.openModal('interCityModal');
                this.loadInterCityRoutes();
            });
        }

        // Schedule for later
        const scheduleForLaterCard = document.getElementById('scheduleForLaterCard');
        if (scheduleForLaterCard) {
            scheduleForLaterCard.addEventListener('click', () => {
                this.openModal('scheduleForLaterModal');
                this.setupScheduleForm();
            });
        }

        // Travel history
        const travelHistoryCard = document.getElementById('travelHistoryCard');
        if (travelHistoryCard) {
            travelHistoryCard.addEventListener('click', () => {
                this.openModal('travelHistoryModal');
                this.loadTravelHistory();
            });
        }
    },

    // Setup action card click handlers
    setupActionCards() {
        // Transport Near You
        const transportCard = document.getElementById('transportNearCard');
        if (transportCard) {
            transportCard.addEventListener('click', () => {
                this.openModal('transportModal');
                this.loadNearbyTransport();
            });
        }

        // Schedule Card
        const scheduleCard = document.getElementById('scheduleCard');
        if (scheduleCard) {
            scheduleCard.addEventListener('click', () => {
                this.openModal('scheduleModal');
                this.loadSchedule();
            });
        }

        // Prices Card
        const pricesCard = document.getElementById('pricesCard');
        if (pricesCard) {
            pricesCard.addEventListener('click', () => {
                this.openModal('pricesModal');
                this.loadPrices();
            });
        }

        // Bus Stop Card
        const busStopCard = document.getElementById('busStopCard');
        if (busStopCard) {
            busStopCard.addEventListener('click', () => {
                this.openModal('busStopModal');
                this.loadBusStops();
            });
        }
    },

    // Setup modal controls
    setupModals() {
        // Close buttons
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.closeModal(modalId);
            });
        });

        // Click outside to close
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Setup tab switching for all modals
        this.setupTabSwitching();

        // Setup route filtering
        this.setupRouteFiltering();

        // Setup travel history tabs
        this.setupTravelHistoryTabs();
    },

    // Setup tab switching functionality
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                if (tabId) {
                    this.switchTab(tabId, e.target.closest('.modal'));
                }
            });
        });
    },

    // Setup route filtering
    setupRouteFiltering() {
        // Inter-state filters
        const fromState = document.getElementById('fromState');
        const toState = document.getElementById('toState');
        const interStateType = document.getElementById('interStateTransportType');

        if (fromState && toState && interStateType) {
            [fromState, toState, interStateType].forEach(filter => {
                filter.addEventListener('change', this.filterInterStateRoutes.bind(this));
            });
        }

        // Inter-city filters
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const interCityType = document.getElementById('interCityTransportType');

        if (fromCity && toCity && interCityType) {
            [fromCity, toCity, interCityType].forEach(filter => {
                filter.addEventListener('change', this.filterInterCityRoutes.bind(this));
            });
        }
    },

    // Setup travel history tabs
    setupTravelHistoryTabs() {
        // Trip search functionality
        const searchTrips = document.querySelector('.search-trips');
        if (searchTrips) {
            searchTrips.addEventListener('input', this.debounce(this.searchTrips.bind(this), 300));
        }

        // Date filtering
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');
        if (fromDate && toDate) {
            fromDate.addEventListener('change', this.filterTripsByDate.bind(this));
            toDate.addEventListener('change', this.filterTripsByDate.bind(this));
        }

        // Schedule trip form
        const saveScheduledTrip = document.getElementById('saveScheduledTrip');
        if (saveScheduledTrip) {
            saveScheduledTrip.addEventListener('click', this.saveScheduledTrip.bind(this));
        }
    },

    // Setup search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
    },

    // Setup toggle switch
    setupToggleSwitch() {
        const toggleSwitch = document.getElementById('trackToggle');
        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', (e) => {
                this.state.isTrackingEnabled = e.target.checked;
                this.handleTrackingToggle(e.target.checked);
            });
        }
    },

    // Setup mobile menu
    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
    },

    // Use current location for journey planning
    useCurrentLocationForJourney() {
        if (this.state.userLocation) {
            const currentLocationInput = document.getElementById('currentLocation');
            if (currentLocationInput) {
                currentLocationInput.value = 'Current Location (GPS)';
                this.showNotification('Using your current location', 'success');
            }
        } else {
            this.requestLocation().then(() => {
                if (this.state.userLocation) {
                    this.useCurrentLocationForJourney();
                }
            });
        }
    },

    // Swap journey locations
    swapJourneyLocations() {
        const currentLocationInput = document.getElementById('currentLocation');
        const destinationInput = document.getElementById('destination');
        
        if (currentLocationInput && destinationInput) {
            const tempValue = currentLocationInput.value;
            currentLocationInput.value = destinationInput.value;
            destinationInput.value = tempValue;
            
            // Add animation effect
            const swapButton = document.getElementById('swapLocations');
            if (swapButton) {
                swapButton.style.transform = 'translateY(-50%) rotate(180deg)';
                setTimeout(() => {
                    swapButton.style.transform = 'translateY(-50%) rotate(0deg)';
                }, 300);
            }
            
            this.showNotification('Locations swapped!', 'info');
        }
    },

    // Handle time preference change
    handleTimePreferenceChange(event) {
        const timeSelector = document.getElementById('timeSelector');
        const selectedTime = document.getElementById('selectedTime');
        
        if (event.target.value === 'now') {
            timeSelector.style.display = 'none';
        } else {
            timeSelector.style.display = 'flex';
            if (selectedTime) {
                // Set default to current time + 1 hour
                const now = new Date();
                now.setHours(now.getHours() + 1);
                selectedTime.value = now.toISOString().slice(0, 16);
            }
        }
    },

    // Search transport routes
    async searchTransportRoutes() {
        const currentLocation = document.getElementById('currentLocation').value;
        const destination = document.getElementById('destination').value;
        const searchButton = document.getElementById('searchRoutes');
        const availableOptions = document.getElementById('availableOptions');

        if (!currentLocation || !destination) {
            this.showNotification('Please enter both current location and destination', 'warning');
            return;
        }

        if (currentLocation === destination) {
            this.showNotification('Current location and destination cannot be the same', 'warning');
            return;
        }

        // Show loading state
        searchButton.classList.add('loading');
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching Routes...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate route options
            const routeOptions = this.generateTransportOptions(currentLocation, destination);
            
            // Show available options section
            availableOptions.classList.add('show');
            availableOptions.style.display = 'block';

            // Populate transport options
            this.displayTransportOptions(routeOptions);
            
            this.showNotification(`Found ${routeOptions.length} transport options!`, 'success');

        } catch (error) {
            this.showNotification('Error finding routes. Please try again.', 'error');
        } finally {
            // Reset button
            searchButton.classList.remove('loading');
            searchButton.innerHTML = '<i class="fas fa-search"></i> Find Routes';
        }
    },

    // Generate transport options
    generateTransportOptions(from, to) {
        const transportTypes = [
            {
                type: 'Bus',
                icon: 'bus',
                name: 'State Transport Bus',
                operator: 'MSRTC Express',
                price: Math.floor(Math.random() * 200) + 50,
                duration: '2h 30m',
                distance: '145 km',
                crowdLevel: Math.floor(Math.random() * 100),
                onTimePerformance: Math.floor(Math.random() * 30) + 70,
                nextDeparture: this.getNextDeparture()
            },
            {
                type: 'Train',
                icon: 'train',
                name: 'Intercity Express',
                operator: 'Indian Railways',
                price: Math.floor(Math.random() * 150) + 80,
                duration: '3h 15m',
                distance: '145 km',
                crowdLevel: Math.floor(Math.random() * 100),
                onTimePerformance: Math.floor(Math.random() * 20) + 80,
                nextDeparture: this.getNextDeparture()
            },
            {
                type: 'Shared Auto',
                icon: 'taxi',
                name: 'Shared Taxi',
                operator: 'Local Operators',
                price: Math.floor(Math.random() * 100) + 100,
                duration: '2h 00m',
                distance: '145 km',
                crowdLevel: Math.floor(Math.random() * 100),
                onTimePerformance: Math.floor(Math.random() * 40) + 60,
                nextDeparture: this.getNextDeparture()
            }
        ];

        return transportTypes.map((transport, index) => ({
            ...transport,
            id: `transport_${index}`,
            from: from,
            to: to,
            status: this.getRandomStatus()
        }));
    },

    // Display transport options
    displayTransportOptions(options) {
        const optionsList = document.getElementById('transportOptionsList');
        if (!optionsList) return;

        optionsList.innerHTML = options.map(option => `
            <div class="transport-option-card" data-transport-id="${option.id}">
                <div class="option-header">
                    <div class="transport-type">
                        <div class="transport-type-icon">
                            <i class="fas fa-${option.icon}"></i>
                        </div>
                        <div class="transport-info">
                            <h3>${option.name}</h3>
                            <p>${option.operator}</p>
                        </div>
                    </div>
                    <div class="option-price">
                        <span class="price-amount">₹${option.price}</span>
                        <span class="price-per">per person</span>
                    </div>
                </div>
                
                <div class="option-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${option.duration}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-route"></i>
                        <span>${option.distance}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${this.getCrowdText(option.crowdLevel)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Next: ${option.nextDeparture}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-check-circle"></i>
                        <span class="status-indicator status-${option.status}">${this.getStatusText(option.status)}</span>
                    </div>
                </div>
                
                <div class="option-actions">
                    <button class="view-details-btn" onclick="TransitTracker.viewTransportDetails('${option.id}')">
                        <i class="fas fa-info-circle"></i>
                        View Details
                    </button>
                    <button class="quick-book-btn" onclick="TransitTracker.quickBookTransport('${option.id}')">
                        <i class="fas fa-ticket-alt"></i>
                        Quick Book
                    </button>
                </div>
            </div>
        `).join('');

        // Store options in state
        this.state.currentTransportOptions = options;
    },

    // View transport details
    viewTransportDetails(transportId) {
        const transport = this.state.currentTransportOptions?.find(t => t.id === transportId);
        if (!transport) return;

        this.state.selectedTransportDetails = transport;
        this.openModal('transportDetailsModal');
        this.loadTransportDetailsData(transport);
    },

    // Load transport details data
    loadTransportDetailsData(transport) {
        // Load route timeline
        this.loadRouteTimeline(transport);
        
        // Load crowd information
        this.loadCrowdInformation(transport);
        
        // Load pricing details
        this.loadPricingDetails(transport);
        
        // Update booking summary
        this.updateBookingSummary(transport);
    },

    // Load route timeline
    loadRouteTimeline(transport) {
        const timeline = document.getElementById('routeTimeline');
        if (!timeline) return;

        const stops = this.generateRouteStops(transport);
        timeline.innerHTML = stops.map((stop, index) => `
            <div class="timeline-item">
                <div class="timeline-icon">
                    ${index + 1}
                </div>
                <div class="timeline-content">
                    <h4>${stop.name}</h4>
                    <p>${stop.time} • ${stop.description}</p>
                </div>
            </div>
        `).join('');
    },

    // Load crowd information
    loadCrowdInformation(transport) {
        const crowdLevel = document.getElementById('crowdLevel');
        const crowdText = document.getElementById('crowdText');
        const crowdTips = document.getElementById('crowdTips');

        if (crowdLevel) {
            crowdLevel.style.width = `${transport.crowdLevel}%`;
        }

        if (crowdText) {
            crowdText.textContent = this.getCrowdText(transport.crowdLevel);
        }

        if (crowdTips) {
            const tips = this.generateCrowdTips(transport.crowdLevel);
            crowdTips.innerHTML = tips.map(tip => `
                <div class="tip-item">
                    <i class="fas fa-lightbulb"></i>
                    <span>${tip}</span>
                </div>
            `).join('');
        }
    },

    // Load pricing details
    loadPricingDetails(transport) {
        const fareBreakdown = document.getElementById('fareBreakdown');
        const paymentMethods = document.getElementById('paymentMethods');
        const offersList = document.getElementById('offersList');

        if (fareBreakdown) {
            const breakdown = this.generateFareBreakdown(transport.price);
            fareBreakdown.innerHTML = breakdown.map((item, index) => `
                <div class="fare-item ${index === breakdown.length - 1 ? 'total' : ''}">
                    <span>${item.label}</span>
                    <span>₹${item.amount}</span>
                </div>
            `).join('');
        }

        if (paymentMethods) {
            const methods = ['credit-card', 'mobile', 'wallet', 'university'];
            paymentMethods.innerHTML = methods.map(method => `
                <div class="payment-method" data-method="${method}">
                    <i class="fas fa-${method === 'mobile' ? 'mobile-alt' : method === 'wallet' ? 'wallet' : method}"></i>
                    <span>${this.getPaymentMethodName(method)}</span>
                </div>
            `).join('');
        }

        if (offersList) {
            const offers = this.generateOffers();
            offersList.innerHTML = offers.map(offer => `
                <div class="offer-item">
                    <div class="offer-badge">${offer.discount}</div>
                    <div class="offer-details">
                        <strong>${offer.title}</strong>
                        <p>${offer.description}</p>
                    </div>
                </div>
            `).join('');
        }
    },

    // Load inter-state routes
    async loadInterStateRoutes() {
        const routesList = document.getElementById('interStateRoutesList');
        if (!routesList) return;

        routesList.classList.add('loading');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const routes = this.generateInterStateRoutes();
            this.state.interStateRoutes = routes;
            this.displayRoutes(routes, routesList);
            
        } catch (error) {
            routesList.innerHTML = '<div class="error">Failed to load inter-state routes.</div>';
        } finally {
            routesList.classList.remove('loading');
        }
    },

    // Load inter-city routes
    async loadInterCityRoutes() {
        const routesList = document.getElementById('interCityRoutesList');
        if (!routesList) return;

        routesList.classList.add('loading');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const routes = this.generateInterCityRoutes();
            this.state.interCityRoutes = routes;
            this.displayRoutes(routes, routesList);
            
        } catch (error) {
            routesList.innerHTML = '<div class="error">Failed to load inter-city routes.</div>';
        } finally {
            routesList.classList.remove('loading');
        }
    },

    // Display routes in list
    displayRoutes(routes, container) {
        if (!routes.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-road"></i>
                    <h3>No Routes Found</h3>
                    <p>Try adjusting your search filters to find available routes.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = routes.map(route => `
            <div class="route-card" data-route-id="${route.id}">
                <div class="route-header">
                    <div class="route-info">
                        <div class="route-name">${route.name}</div>
                        <div class="route-operator">${route.operator}</div>
                        <div class="route-details">
                            <div class="route-detail">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${route.from} → ${route.to}</span>
                            </div>
                            <div class="route-detail">
                                <i class="fas fa-clock"></i>
                                <span>${route.duration}</span>
                            </div>
                            <div class="route-detail">
                                <i class="fas fa-route"></i>
                                <span>${route.distance}</span>
                            </div>
                            <div class="route-detail">
                                <i class="fas fa-calendar"></i>
                                <span>Daily ${route.frequency}</span>
                            </div>
                            <div class="route-detail">
                                <i class="fas fa-star"></i>
                                <span>${route.rating}/5 (${route.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div class="route-price">
                        <span class="price-value">₹${route.price}</span>
                        <span class="price-label">starting from</span>
                    </div>
                </div>
                <div class="route-actions">
                    <button class="route-details-btn" onclick="TransitTracker.viewRouteDetails('${route.id}')">
                        <i class="fas fa-info"></i>
                        Details
                    </button>
                    <button class="route-book-btn" onclick="TransitTracker.bookRoute('${route.id}')">
                        <i class="fas fa-ticket-alt"></i>
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Filter inter-state routes
    filterInterStateRoutes() {
        const fromState = document.getElementById('fromState').value;
        const toState = document.getElementById('toState').value;
        const transportType = document.getElementById('interStateTransportType').value;

        let filteredRoutes = [...this.state.interStateRoutes];

        if (fromState) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.fromState.toLowerCase() === fromState
            );
        }

        if (toState) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.toState.toLowerCase() === toState
            );
        }

        if (transportType) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.type.toLowerCase() === transportType
            );
        }

        const routesList = document.getElementById('interStateRoutesList');
        this.displayRoutes(filteredRoutes, routesList);
    },

    // Filter inter-city routes
    filterInterCityRoutes() {
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const transportType = document.getElementById('interCityTransportType').value;

        let filteredRoutes = [...this.state.interCityRoutes];

        if (fromCity) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.from.toLowerCase().includes(fromCity)
            );
        }

        if (toCity) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.to.toLowerCase().includes(toCity)
            );
        }

        if (transportType) {
            filteredRoutes = filteredRoutes.filter(route => 
                route.type.toLowerCase() === transportType
            );
        }

        const routesList = document.getElementById('interCityRoutesList');
        this.displayRoutes(filteredRoutes, routesList);
    },

    // Setup schedule form
    setupScheduleForm() {
        // Set minimum date to today
        const travelDate = document.getElementById('travelDate');
        if (travelDate) {
            const today = new Date().toISOString().split('T')[0];
            travelDate.min = today;
            
            // Set default to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            travelDate.value = tomorrow.toISOString().split('T')[0];
        }

        // Set default time
        const preferredTime = document.getElementById('preferredTime');
        if (preferredTime) {
            const now = new Date();
            preferredTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        }
    },

    // Save scheduled trip
    async saveScheduledTrip() {
        const tripData = this.getScheduleTripFormData();
        
        if (!this.validateScheduleTripData(tripData)) {
            return;
        }

        const saveBtn = document.getElementById('saveScheduledTrip');
        const originalContent = saveBtn.innerHTML;
        
        try {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
            saveBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Add to scheduled trips
            const newTrip = {
                id: `scheduled_${Date.now()}`,
                ...tripData,
                status: 'scheduled',
                createdAt: new Date(),
                notifications: tripData.notifications
            };

            this.state.scheduledTrips.push(newTrip);
            this.saveToLocalStorage();

            this.showNotification('Trip scheduled successfully!', 'success');
            this.closeModal('scheduleForLaterModal');
            this.clearScheduleForm();

        } catch (error) {
            this.showNotification('Error scheduling trip. Please try again.', 'error');
        } finally {
            saveBtn.innerHTML = originalContent;
            saveBtn.disabled = false;
        }
    },

    // Get schedule trip form data
    getScheduleTripFormData() {
        return {
            name: document.getElementById('tripName').value,
            from: document.getElementById('scheduleFrom').value,
            to: document.getElementById('scheduleTo').value,
            date: document.getElementById('travelDate').value,
            time: document.getElementById('preferredTime').value,
            transportPreferences: Array.from(document.querySelectorAll('.preference-checkboxes input:checked')).map(cb => cb.value),
            notifications: Array.from(document.querySelectorAll('.notification-options input:checked')).map(cb => cb.parentElement.textContent.trim())
        };
    },

    // Validate schedule trip data
    validateScheduleTripData(data) {
        if (!data.name) {
            this.showNotification('Please enter a trip name', 'warning');
            return false;
        }
        if (!data.from || !data.to) {
            this.showNotification('Please enter both origin and destination', 'warning');
            return false;
        }
        if (!data.date || !data.time) {
            this.showNotification('Please select travel date and time', 'warning');
            return false;
        }
        if (data.transportPreferences.length === 0) {
            this.showNotification('Please select at least one transport preference', 'warning');
            return false;
        }
        return true;
    },

    // Clear schedule form
    clearScheduleForm() {
        document.getElementById('tripName').value = '';
        document.getElementById('scheduleFrom').value = '';
        document.getElementById('scheduleTo').value = '';
        document.querySelectorAll('.preference-checkboxes input').forEach(cb => cb.checked = false);
    },

    // Load travel history
    async loadTravelHistory() {
        try {
            // Load from localStorage if available
            this.loadFromLocalStorage();

            // Switch to current trips tab by default
            this.switchTab('current', document.getElementById('travelHistoryModal'));
            this.loadCurrentTrips();

        } catch (error) {
            console.error('Error loading travel history:', error);
        }
    },

    // Load current trips
    loadCurrentTrips() {
        const tripsList = document.getElementById('currentTripsList');
        if (!tripsList) return;

        if (!this.state.currentTrips.length) {
            tripsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-route"></i>
                    <h3>No Current Trips</h3>
                    <p>You don't have any active trips at the moment.</p>
                </div>
            `;
            return;
        }

        tripsList.innerHTML = this.state.currentTrips.map(trip => this.renderTripCard(trip, 'current')).join('');
    },

    // Load scheduled trips
    loadScheduledTrips() {
        const tripsList = document.getElementById('scheduledTripsList');
        if (!tripsList) return;

        if (!this.state.scheduledTrips.length) {
            tripsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar"></i>
                    <h3>No Scheduled Trips</h3>
                    <p>You haven't scheduled any trips yet. Use "Schedule for Later" to plan your future journeys.</p>
                </div>
            `;
            return;
        }

        tripsList.innerHTML = this.state.scheduledTrips.map(trip => this.renderTripCard(trip, 'scheduled')).join('');
    },

    // Load previous trips
    loadPreviousTrips() {
        const tripsList = document.getElementById('previousTripsList');
        if (!tripsList) return;

        if (!this.state.previousTrips.length) {
            tripsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No Previous Trips</h3>
                    <p>Your completed trips will appear here.</p>
                </div>
            `;
            return;
        }

        tripsList.innerHTML = this.state.previousTrips.map(trip => this.renderTripCard(trip, 'previous')).join('');
    },

    // Render trip card
    renderTripCard(trip, type) {
        const statusClass = this.getTripStatusClass(trip.status);
        const actionButtons = this.getTripActionButtons(trip, type);

        return `
            <div class="trip-card ${type}" data-trip-id="${trip.id}">
                <div class="trip-header">
                    <div class="trip-route">
                        <div class="trip-locations">
                            <div class="trip-from">${trip.from}</div>
                            <div class="trip-to">${trip.to}</div>
                        </div>
                        <div class="trip-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                    <div class="trip-status ${statusClass}">
                        ${this.getStatusText(trip.status)}
                    </div>
                </div>
                
                <div class="trip-details">
                    <div class="trip-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(trip.date)}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-clock"></i>
                        <span>${trip.time}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-bus"></i>
                        <span>${trip.transportType || 'Bus'}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-rupee-sign"></i>
                        <span>₹${trip.price || 'N/A'}</span>
                    </div>
                    ${trip.duration ? `
                    <div class="trip-detail">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${trip.duration}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="trip-actions">
                    ${actionButtons}
                </div>
            </div>
        `;
    },

    // Get trip action buttons based on type and status
    getTripActionButtons(trip, type) {
        switch (type) {
            case 'current':
                return `
                    <button class="trip-action-btn primary" onclick="TransitTracker.trackTrip('${trip.id}')">
                        <i class="fas fa-map-marker-alt"></i> Track Live
                    </button>
                    <button class="trip-action-btn" onclick="TransitTracker.viewTripDetails('${trip.id}')">
                        <i class="fas fa-info"></i> Details
                    </button>
                `;
            case 'scheduled':
                return `
                    <button class="trip-action-btn primary" onclick="TransitTracker.modifyTrip('${trip.id}')">
                        <i class="fas fa-edit"></i> Modify
                    </button>
                    <button class="trip-action-btn" onclick="TransitTracker.cancelTrip('${trip.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button class="trip-action-btn" onclick="TransitTracker.viewTripDetails('${trip.id}')">
                        <i class="fas fa-info"></i> Details
                    </button>
                `;
            case 'previous':
                return `
                    <button class="trip-action-btn primary" onclick="TransitTracker.rebookTrip('${trip.id}')">
                        <i class="fas fa-redo"></i> Book Again
                    </button>
                    <button class="trip-action-btn" onclick="TransitTracker.viewReceipt('${trip.id}')">
                        <i class="fas fa-receipt"></i> Receipt
                    </button>
                    <button class="trip-action-btn" onclick="TransitTracker.rateTrip('${trip.id}')">
                        <i class="fas fa-star"></i> Rate
                    </button>
                `;
            default:
                return '';
        }
    },

    // Switch tab functionality
    switchTab(tabId, modal) {
        if (!modal) return;

        // Update tab buttons
        const tabButtons = modal.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        const tabContents = modal.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}Tab` || content.id.includes(tabId)) {
                content.classList.add('active');
            }
        });

        // Load tab-specific content
        this.loadTabContent(tabId, modal);
    },

    // Load tab content
    loadTabContent(tabId, modal) {
        if (modal.id === 'travelHistoryModal') {
            switch (tabId) {
                case 'current':
                    this.loadCurrentTrips();
                    break;
                case 'scheduled':
                    this.loadScheduledTrips();
                    break;
                case 'previous':
                    this.loadPreviousTrips();
                    break;
            }
        }
    },

    // Search trips functionality
    searchTrips(event) {
        const query = event.target.value.toLowerCase();
        const activeTab = document.querySelector('.history-tabs .tab-btn.active').getAttribute('data-tab');
        
        // Filter trips based on query and active tab
        console.log(`Searching trips in ${activeTab} tab for: ${query}`);
    },

    // Filter trips by date
    filterTripsByDate() {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        
        // Filter previous trips by date range
        console.log(`Filtering trips from ${fromDate} to ${toDate}`);
    },

    // Initialize sample data
    initializeSampleData() {
        // Sample current trips
        this.state.currentTrips = [
            {
                id: 'current_1',
                name: 'Work Commute',
                from: 'Home',
                to: 'Office Complex',
                date: new Date(),
                time: '09:30 AM',
                status: 'active',
                transportType: 'Bus',
                price: 45,
                duration: '45 min'
            }
        ];

        // Sample scheduled trips
        this.state.scheduledTrips = [
            {
                id: 'scheduled_1',
                name: 'Weekend Trip',
                from: 'Pune',
                to: 'Mumbai',
                date: new Date(Date.now() + 86400000 * 2), // 2 days from now
                time: '10:00 AM',
                status: 'scheduled',
                transportType: 'Train',
                price: 285,
                duration: '3h 15m'
            }
        ];

        // Sample previous trips
        this.state.previousTrips = [
            {
                id: 'previous_1',
                name: 'Business Trip',
                from: 'Nashik',
                to: 'Aurangabad',
                date: new Date(Date.now() - 86400000 * 7), // 7 days ago
                time: '02:30 PM',
                status: 'completed',
                transportType: 'Bus',
                price: 125,
                duration: '2h 30m'
            }
        ];
    },

    // Generate data functions
    generateInterStateRoutes() {
        const routes = [];
        const states = [
            { name: 'Maharashtra', code: 'maharashtra' },
            { name: 'Karnataka', code: 'karnataka' },
            { name: 'Tamil Nadu', code: 'tamil-nadu' },
            { name: 'Gujarat', code: 'gujarat' },
            { name: 'Rajasthan', code: 'rajasthan' }
        ];

        const operators = [
            'MSRTC Express', 'Karnataka SRTC', 'Tamil Nadu Transport',
            'Gujarat State Transport', 'Rajasthan Roadways', 'Indian Railways'
        ];

        const transportTypes = ['bus', 'train', 'flight'];

        for (let i = 0; i < 15; i++) {
            const fromState = states[Math.floor(Math.random() * states.length)];
            const toState = states[Math.floor(Math.random() * states.length)];
            
            if (fromState.code !== toState.code) {
                routes.push({
                    id: `interstate_${i}`,
                    name: `${fromState.name} - ${toState.name} Express`,
                    operator: operators[Math.floor(Math.random() * operators.length)],
                    from: fromState.name,
                    to: toState.name,
                    fromState: fromState.code,
                    toState: toState.code,
                    type: transportTypes[Math.floor(Math.random() * transportTypes.length)],
                    price: Math.floor(Math.random() * 1000) + 200,
                    duration: `${Math.floor(Math.random() * 8) + 4}h ${Math.floor(Math.random() * 60)}m`,
                    distance: `${Math.floor(Math.random() * 800) + 200} km`,
                    frequency: `${Math.floor(Math.random() * 6) + 2} trips`,
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    reviews: Math.floor(Math.random() * 500) + 50
                });
            }
        }

        return routes;
    },

    generateInterCityRoutes() {
        const routes = [];
        const cities = ['Pune', 'Nashik', 'Aurangabad', 'Nagpur', 'Kolhapur', 'Solapur', 'Sangli'];
        const operators = ['MSRTC', 'Local Bus Service', 'Express Transport', 'City Connect'];
        const transportTypes = ['bus', 'train', 'shared-taxi'];

        for (let i = 0; i < 12; i++) {
            const fromCity = cities[Math.floor(Math.random() * cities.length)];
            const toCity = cities[Math.floor(Math.random() * cities.length)];
            
            if (fromCity !== toCity) {
                routes.push({
                    id: `intercity_${i}`,
                    name: `${fromCity} - ${toCity} Service`,
                    operator: operators[Math.floor(Math.random() * operators.length)],
                    from: fromCity,
                    to: toCity,
                    type: transportTypes[Math.floor(Math.random() * transportTypes.length)],
                    price: Math.floor(Math.random() * 300) + 50,
                    duration: `${Math.floor(Math.random() * 4) + 1}h ${Math.floor(Math.random() * 60)}m`,
                    distance: `${Math.floor(Math.random() * 200) + 50} km`,
                    frequency: `${Math.floor(Math.random() * 10) + 3} trips`,
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                    reviews: Math.floor(Math.random() * 200) + 20
                });
            }
        }

        return routes;
    },

    generateRouteStops(transport) {
        const stops = [
            { name: transport.from, time: '10:00 AM', description: 'Departure point' },
            { name: 'Highway Junction', time: '10:45 AM', description: '5 min stop' },
            { name: 'Rest Area', time: '12:00 PM', description: '15 min break' },
            { name: transport.to, time: transport.nextDeparture, description: 'Final destination' }
        ];
        return stops;
    },

    generateCrowdTips(crowdLevel) {
        if (crowdLevel > 80) {
            return [
                'Consider booking the next available transport',
                'Travel during off-peak hours for more comfort',
                'Book reserved seats if available'
            ];
        } else if (crowdLevel > 50) {
            return [
                'Moderate crowd expected, arrive 10 minutes early',
                'Keep your belongings secure',
                'Consider premium options for more space'
            ];
        } else {
            return [
                'Great time to travel with comfortable seating',
                'Enjoy a pleasant journey with minimal crowds',
                'Perfect for a relaxed trip'
            ];
        }
    },

    generateFareBreakdown(price) {
        const basePrice = Math.floor(price * 0.8);
        const tax = Math.floor(price * 0.1);
        const serviceFee = price - basePrice - tax;
        
        return [
            { label: 'Base Fare', amount: basePrice },
            { label: 'Service Fee', amount: serviceFee },
            { label: 'Taxes', amount: tax },
            { label: 'Total Amount', amount: price }
        ];
    },

    generateOffers() {
        return [
            {
                discount: '15% OFF',
                title: 'First Time User',
                description: 'Get 15% discount on your first booking'
            },
            {
                discount: '₹50 OFF',
                title: 'Weekend Special',
                description: 'Save ₹50 on weekend travel bookings'
            },
            {
                discount: '20% OFF',
                title: 'Student Discount',
                description: 'Special discount for students with valid ID'
            }
        ];
    },

    // Utility functions
    getNextDeparture() {
        const now = new Date();
        const departure = new Date(now.getTime() + (Math.floor(Math.random() * 120) + 30) * 60000);
        return departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    getRandomStatus() {
        const statuses = ['on-time', 'delayed', 'early'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    },

    getCrowdText(level) {
        if (level > 80) return 'Very Crowded';
        if (level > 60) return 'Moderately Crowded';
        if (level > 30) return 'Light Crowd';
        return 'Not Crowded';
    },

    getStatusText(status) {
        const statusMap = {
            'on-time': 'On Time',
            'delayed': 'Delayed',
            'early': 'Early',
            'active': 'Active',
            'scheduled': 'Scheduled',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    },

    getTripStatusClass(status) {
        const classMap = {
            'active': 'status-active',
            'scheduled': 'status-scheduled',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return classMap[status] || '';
    },

    getPaymentMethodName(method) {
        const names = {
            'credit-card': 'Cards',
            'mobile': 'UPI',
            'wallet': 'Wallet',
            'university': 'Cash'
        };
        return names[method] || method;
    },

    formatDate(date) {
        if (typeof date === 'string') date = new Date(date);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    // Trip action functions
    trackTrip(tripId) {
        this.showNotification('Opening live tracking...', 'info');
        // Implementation for live tracking
    },

    modifyTrip(tripId) {
        this.showNotification('Opening trip modification...', 'info');
        // Implementation for trip modification
    },

    cancelTrip(tripId) {
        if (confirm('Are you sure you want to cancel this trip?')) {
            // Remove from scheduled trips
            this.state.scheduledTrips = this.state.scheduledTrips.filter(trip => trip.id !== tripId);
            this.saveToLocalStorage();
            this.loadScheduledTrips();
            this.showNotification('Trip cancelled successfully', 'success');
        }
    },

    rebookTrip(tripId) {
        const trip = this.state.previousTrips.find(t => t.id === tripId);
        if (trip) {
            // Pre-fill journey planner with trip details
            document.getElementById('currentLocation').value = trip.from;
            document.getElementById('destination').value = trip.to;
            this.closeModal('travelHistoryModal');
            this.showNotification('Trip details filled. Adjust and search for new options.', 'info');
        }
    },

    viewTripDetails(tripId) {
        this.showNotification('Loading trip details...', 'info');
        // Implementation for detailed trip view
    },

    viewReceipt(tripId) {
        this.showNotification('Downloading receipt...', 'info');
        // Implementation for receipt download
    },

    rateTrip(tripId) {
        this.showNotification('Opening rating dialog...', 'info');
        // Implementation for trip rating
    },

    viewRouteDetails(routeId) {
        this.showNotification('Loading route details...', 'info');
        // Implementation for route details
    },

    bookRoute(routeId) {
        this.showNotification('Redirecting to booking...', 'info');
        // Implementation for route booking
    },

    quickBookTransport(transportId) {
        this.showNotification('Opening quick booking...', 'info');
        // Implementation for quick booking
    },

    // Local storage functions
    saveToLocalStorage() {
        const data = {
            scheduledTrips: this.state.scheduledTrips,
            currentTrips: this.state.currentTrips,
            previousTrips: this.state.previousTrips
        };
        localStorage.setItem('transitTracker', JSON.stringify(data));
    },

    loadFromLocalStorage() {
        const stored = localStorage.getItem('transitTracker');
        if (stored) {
            const data = JSON.parse(stored);
            this.state.scheduledTrips = data.scheduledTrips || [];
            this.state.currentTrips = data.currentTrips || [];
            this.state.previousTrips = data.previousTrips || [];
        }
    },

    updateBookingSummary(transport) {
        const summaryRoute = document.getElementById('summaryRoute');
        const summaryTime = document.getElementById('summaryTime');
        const summaryFare = document.getElementById('summaryFare');

        if (summaryRoute) summaryRoute.textContent = `${transport.from} → ${transport.to}`;
        if (summaryTime) summaryTime.textContent = transport.nextDeparture;
        if (summaryFare) summaryFare.textContent = `₹${transport.price}`;
    },

    showFavoriteDestinations() {
        const favorites = ['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Kolhapur'];
        // Show dropdown or modal with favorite destinations
        this.showNotification('Favorite destinations: ' + favorites.join(', '), 'info');
    },

    // Request user location
    async requestLocation() {
        const locationBtn = document.getElementById('locationBtn');
        const currentLocationDiv = document.getElementById('currentLocationDisplay');

        if (!navigator.geolocation) {
            this.showNotification('Geolocation is not supported by this browser.', 'error');
            return;
        }

        // Update button state
        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        locationBtn.disabled = true;

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });

            this.state.userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            this.state.isLocationEnabled = true;

            // Get city name using reverse geocoding (simulated)
            const cityName = await this.getCityName(this.state.userLocation);
            
            if (currentLocationDiv) {
                currentLocationDiv.innerHTML = `<span class="city-name">${cityName}</span>`;
            }
            locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Updated';
            locationBtn.style.background = '#00C851';

            this.showNotification('Location detected successfully!', 'success');
            
            // Enable location-dependent features
            this.enableLocationFeatures();

        } catch (error) {
            console.error('Location error:', error);
            locationBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location Failed';
            locationBtn.style.background = '#FF6B35';
            
            let errorMessage = 'Unable to get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Please enable location permissions.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            locationBtn.disabled = false;
        }
    },

    // Simulate getting city name from coordinates
    async getCityName(location) {
        // In a real implementation, you would use a reverse geocoding API
        const cities = [
            'Nashik, Maharashtra',
            'Mysuru, Karnataka',
            'Mangaluru, Karnataka',
            'Coimbatore, Tamil Nadu',
            'Vijayawada, Andhra Pradesh',
            'Madurai, Tamil Nadu',
            'Varanasi, Uttar Pradesh',
            'Agra, Uttar Pradesh',
            'Amritsar, Punjab',
            'Udaipur, Rajasthan'
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return cities[Math.floor(Math.random() * cities.length)];
    },

    // Enable features that require location
    enableLocationFeatures() {
        // Add visual indicators that location-dependent features are now available
        const locationDependentCards = [
            'transportNearCard',
            'scheduleCard',
            'busStopCard'
        ];

        locationDependentCards.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.add('pulse');
                setTimeout(() => card.classList.remove('pulse'), 2000);
            }
        });
    },

    // Handle tracking toggle
    handleTrackingToggle(enabled) {
        if (enabled) {
            if (!this.state.isLocationEnabled) {
                this.showNotification('Please enable location access first.', 'warning');
                document.getElementById('trackToggle').checked = false;
                this.state.isTrackingEnabled = false;
                return;
            }
            
            this.startRideTracking();
            this.showNotification('Ride tracking enabled!', 'success');
        } else {
            this.stopRideTracking();
            this.showNotification('Ride tracking disabled.', 'info');
        }
    },

    // Start ride tracking
    startRideTracking() {
        console.log('Starting ride tracking...');
        this.trackingInterval = setInterval(() => {
            console.log('Tracking position...');
            // Update user position and nearby transport
        }, 5000);
    },

    // Stop ride tracking
    stopRideTracking() {
        console.log('Stopping ride tracking...');
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
    },

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.state.activeModal = modalId;
        }
    },

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.state.activeModal = null;
        }
    },

    // Close all modals
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
        this.state.activeModal = null;
    },

    // Load nearby transport data
    async loadNearbyTransport() {
        const mapContainer = document.getElementById('transportMap');
        if (!mapContainer) return;

        mapContainer.innerHTML = '<div class="loading">Loading transport data...</div>';

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const transportData = this.generateNearbyTransportData();
            this.state.nearbyTransport = transportData;

            mapContainer.innerHTML = `
                <div class="transport-list">
                    <h4>Transport Near Your Location</h4>
                    ${transportData.map(transport => `
                        <div class="transport-item">
                            <div class="transport-icon">
                                <i class="fas fa-${transport.icon}"></i>
                            </div>
                            <div class="transport-details">
                                <h5>${transport.name}</h5>
                                <p>${transport.route}</p>
                                <span class="distance">${transport.distance} away</span>
                                <span class="eta">ETA: ${transport.eta}</span>
                            </div>
                            <div class="transport-status ${transport.status}">
                                ${transport.status}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="map-note">
                    <p><i class="fas fa-info-circle"></i> In a real implementation, this would show an interactive map with live transport positions using Google Maps or similar mapping service.</p>
                </div>
            `;
        } catch (error) {
            mapContainer.innerHTML = '<div class="error">Failed to load transport data.</div>';
        }
    },

    // Generate sample nearby transport data
    generateNearbyTransportData() {
        const transportTypes = [
            { name: 'Bus 47A', route: 'City Center - Railway Station', icon: 'bus', status: 'on-time' },
            { name: 'Bus 23B', route: 'Airport - Downtown', icon: 'bus', status: 'delayed' },
            { name: 'Metro Red Line', route: 'North - South Corridor', icon: 'subway', status: 'on-time' },
            { name: 'Local Train', route: 'Suburban Route', icon: 'train', status: 'on-time' },
            { name: 'Bus 156', route: 'Industrial Area - City Center', icon: 'bus', status: 'early' }
        ];

        return transportTypes.map(transport => ({
            ...transport,
            distance: `${Math.floor(Math.random() * 800) + 100}m`,
            eta: `${Math.floor(Math.random() * 15) + 2} min`
        }));
    },

    // Load schedule data
    async loadSchedule() {
        const scheduleContainer = document.getElementById('scheduleList');
        if (!scheduleContainer) return;

        scheduleContainer.innerHTML = '<div class="loading">Loading schedule...</div>';

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const scheduleData = this.generateScheduleData();
            this.state.schedules = scheduleData;

            scheduleContainer.innerHTML = scheduleData.map(item => `
                <div class="schedule-item">
                    <div class="schedule-time">${item.time}</div>
                    <div class="schedule-details">
                        <h4>${item.route}</h4>
                        <p>${item.description}</p>
                        <div class="schedule-meta">
                            <span class="transport-type">${item.type}</span>
                            <span class="schedule-status ${item.status}">${item.statusText}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            scheduleContainer.innerHTML = '<div class="error">Failed to load schedule data.</div>';
        }
    },

    // Generate sample schedule data
    generateScheduleData() {
        const now = new Date();
        const schedules = [];
        
        for (let i = 0; i < 8; i++) {
            const time = new Date(now.getTime() + (i * 30 * 60000)); // 30-minute intervals
            const routes = [
                { route: 'Route 47A', description: 'City Center → Railway Station', type: 'Bus' },
                { route: 'Metro Red Line', description: 'North → South Corridor', type: 'Metro' },
                { route: 'Route 23B', description: 'Airport → Downtown', type: 'Bus' },
                { route: 'Suburban Line', description: 'Express Service', type: 'Train' }
            ];
            
            const randomRoute = routes[Math.floor(Math.random() * routes.length)];
            const statuses = [
                { status: 'on-time', statusText: 'On Time' },
                { status: 'delayed', statusText: 'Delayed 5 min' },
                { status: 'early', statusText: 'Early' }
            ];
            
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            schedules.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ...randomRoute,
                ...randomStatus
            });
        }
        
        return schedules;
    },

    // Load price comparison data
    async loadPrices() {
        const pricesContainer = document.getElementById('pricesList');
        if (!pricesContainer) return;

        pricesContainer.innerHTML = '<div class="loading">Loading price data...</div>';

        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            const priceData = this.generatePriceData();
            this.state.prices = priceData;

            pricesContainer.innerHTML = priceData.map(item => `
                <div class="price-item">
                    <div class="price-header">
                        <h4>${item.destination}</h4>
                        <div class="price-amount">₹${item.price}</div>
                    </div>
                    <div class="price-details">
                        <div class="transport-options">
                            ${item.options.map(option => `
                                <div class="transport-option">
                                    <i class="fas fa-${option.icon}"></i>
                                    <span>${option.type}: ₹${option.price}</span>
                                    <span class="duration">${option.duration}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            pricesContainer.innerHTML = '<div class="error">Failed to load price data.</div>';
        }
    },

    // Generate sample price data
    generatePriceData() {
        const destinations = [
            'City Center', 'Railway Station', 'Airport', 'Industrial Area',
            'University Campus', 'Shopping Mall', 'Hospital Complex', 'Government Sector'
        ];

        return destinations.map(destination => {
            const basePrice = Math.floor(Math.random() * 50) + 10;
            return {
                destination,
                price: basePrice,
                options: [
                    { type: 'Bus', icon: 'bus', price: basePrice, duration: '25-30 min' },
                    { type: 'Metro', icon: 'subway', price: basePrice + 5, duration: '15-20 min' },
                    { type: 'Auto', icon: 'taxi', price: basePrice * 2, duration: '15-25 min' }
                ]
            };
        });
    },

    // Load bus stops data
    async loadBusStops() {
        const busStopsContainer = document.getElementById('busStopsList');
        if (!busStopsContainer) return;

        busStopsContainer.innerHTML = '<div class="loading">Finding nearest bus stops...</div>';

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const busStopsData = this.generateBusStopsData();
            this.state.busStops = busStopsData;

            busStopsContainer.innerHTML = busStopsData.map(stop => `
                <div class="bus-stop-item">
                    <div class="bus-stop-info">
                        <h4>${stop.name}</h4>
                        <p>${stop.address}</p>
                        <div class="stop-meta">
                            <span class="distance"><i class="fas fa-walking"></i> ${stop.walkTime}</span>
                            <span class="routes">${stop.routes.length} routes</span>
                        </div>
                    </div>
                    <div class="stop-actions">
                        <button class="action-btn-small" onclick="TransitTracker.getDirections('${stop.name}')">
                            <i class="fas fa-directions"></i> Directions
                        </button>
                        <div class="stop-routes">
                            ${stop.routes.slice(0, 3).map(route => 
                                `<span class="route-badge">${route}</span>`
                            ).join('')}
                            ${stop.routes.length > 3 ? `<span class="route-more">+${stop.routes.length - 3}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            busStopsContainer.innerHTML = '<div class="error">Failed to load bus stops data.</div>';
        }
    },

    // Generate sample bus stops data
    generateBusStopsData() {
        const stopNames = [
            'Central Bus Station', 'Market Square Stop', 'University Gate Stop', 'Hospital Junction',
            'Railway Station Stop', 'Shopping Complex Stop', 'Government Office Stop', 'Industrial Area Gate'
        ];

        return stopNames.map((name, index) => ({
            name,
            address: `${name.replace(' Stop', '')} Area, Sector ${index + 1}`,
            walkTime: `${Math.floor(Math.random() * 10) + 2} min walk`,
            routes: this.generateRoutes(Math.floor(Math.random() * 6) + 3)
        }));
    },

    // Generate route numbers
    generateRoutes(count) {
        const routes = [];
        for (let i = 0; i < count; i++) {
            routes.push(`${Math.floor(Math.random() * 200) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`);
        }
        return routes;
    },

    // Get directions to a bus stop
    getDirections(stopName) {
        this.showNotification(`Opening directions to ${stopName}...`, 'info');
        // In a real app, this would integrate with Google Maps or similar
        console.log(`Getting directions to: ${stopName}`);
    },

    // Handle search input
    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        console.log(`Searching for: ${query}`);
        // Implement search logic here
    },

    // Perform search
    performSearch(query) {
        if (!query.trim()) return;
        
        this.showNotification(`Searching for "${query}"...`, 'info');
        console.log(`Performing search for: ${query}`);
        // Implement actual search functionality
    },

    // Start live updates
    startLiveUpdates() {
        this.updateLiveData();
        this.liveUpdatesInterval = setInterval(() => {
            this.updateLiveData();
        }, 30000); // Update every 30 seconds
    },

    // Update live data
    updateLiveData() {
        const updatesContainer = document.getElementById('liveUpdates');
        if (!updatesContainer) return;

        const updates = this.generateLiveUpdates();
        
        updatesContainer.innerHTML = updates.map(update => `
            <div class="update-item">
                <div class="update-icon">
                    <i class="fas fa-${update.icon}"></i>
                </div>
                <div class="update-content">
                    <div class="update-title">${update.title}</div>
                    <div class="update-time">${update.time}</div>
                </div>
            </div>
        `).join('');
    },

    // Generate live updates
    generateLiveUpdates() {
        const updateTypes = [
            { title: 'Bus 47A arriving in 3 minutes', icon: 'bus', severity: 'info' },
            { title: 'Metro service running normally', icon: 'subway', severity: 'success' },
            { title: 'Route 23B delayed by 5 minutes', icon: 'clock', severity: 'warning' },
            { title: 'New express service added', icon: 'plus-circle', severity: 'success' },
            { title: 'Traffic alert on Main Street', icon: 'exclamation-triangle', severity: 'warning' }
        ];

        return updateTypes.slice(0, 3).map(update => ({
            ...update,
            time: `${Math.floor(Math.random() * 5) + 1} min ago`
        }));
    },

    // Load initial data
    loadInitialData() {
        console.log('Loading initial application data...');
        this.updateLiveData();
        this.loadFromLocalStorage();
    },

    // Setup animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe action cards
        const cards = document.querySelectorAll('.action-card, .category-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    },

    // Handle window resize
    handleResize() {
        // Update layout calculations if needed
        console.log('Window resized');
    },

    // Handle scroll
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--bg-white)';
            navbar.style.backdropFilter = 'none';
        }
    },

    // Toggle mobile menu
    toggleMobileMenu() {
        const navCenter = document.querySelector('.nav-center');
        if (navCenter) {
            navCenter.classList.toggle('active');
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Position notification
        const existingNotifications = document.querySelectorAll('.notification');
        const topOffset = (existingNotifications.length - 1) * 70 + 20;
        notification.style.top = `${topOffset}px`;

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    },

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    },

    // Add notification styles to head
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return; // Already added

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-left: 4px solid var(--primary-color);
            z-index: 3000;
            min-width: 300px;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }

        .notification-success {
            border-left-color: var(--primary-color);
        }

        .notification-error {
            border-left-color: var(--accent-color);
        }

        .notification-warning {
            border-left-color: #FFA500;
        }

        .notification-info {
            border-left-color: var(--secondary-color);
        }

        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 4px;
            border-radius: 4px;
        }

        .notification-close:hover {
            background: var(--bg-light);
            color: var(--text-primary);
        }

        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
                max-width: none;
            }
        }
        `;
        document.head.appendChild(style);
    },

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TransitTracker.init();
});

// Export for global access (useful for debugging)
window.TransitTracker = TransitTracker;

