// js/db.js

/* 
  This file handles all data interactions. 
  It checks if Firestore is connected. If not (or if config is missing), 
  it returns mock data so the app is reviewable immediately.
*/

// Mock Data for Prototype
const MOCK_LABS = [
    { id: 'cs101', title: 'Data Structures', icon: 'fa-layer-group', description: 'Lists, Stacks, Queues, Trees' },
    { id: 'cs102', title: 'Algorithms', icon: 'fa-microchip', description: 'Sorting, Searching, Graph Algos' },
    { id: 'cs103', title: 'Object Oriented Prog', icon: 'fa-cube', description: 'Classes, Objects, Inheritance' }
];

const MOCK_EXPERIMENTS = {
    'cs101': [
        {
            id: 'exp1',
            title: 'Singly Linked List Operations',
            aim: 'To implement insertion, deletion, and traversal in a Singly Linked List.',
            procedure: '1. Define a Node structure.\n2. Create a head pointer.\n3. Implementation insertion at beginning/end.\n4. Traverse to print elements.',
            input: 'Insert 10, Insert 20, Display',
            output: '10 -> 20 -> NULL',
            hints: 'Remember to check if head is NULL before traversing.'
        },
        {
            id: 'exp2',
            title: 'Stack using Array',
            aim: 'Implement a Stack using arrays with push, pop, and peek operations.',
            procedure: '1. Initialize top = -1.\n2. Push: Increment top, add item.\n3. Pop: Return item, decrement top.',
            input: 'Push 5, Push 10, Pop',
            output: 'Popped: 10',
            hints: 'Check for Stack Overflow (top == size-1) and Underflow (top == -1).'
        }
    ],
    'cs102': [
        {
            id: 'exp3',
            title: 'Binary Search',
            aim: 'Find an element in a sorted array using Binary Search.',
            procedure: '1. Set low=0, high=n-1.\n2. Find mid.\n3. Compare target with mid.\n4. Adjust low or high.',
            input: 'Array: [1, 3, 5, 7, 9], Target: 7',
            output: 'Element found at index 3',
            hints: 'The array MUST be sorted first.'
        }
    ]
};

// Data Provider
const DataProvider = {

    // Get all Lab Categories
    async getLabs() {
        if (this.isFirebaseReady()) {
            try {
                const snapshot = await window.db.collection('labs').get();
                if (snapshot.empty) return MOCK_LABS; // Fallback if collection empty
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (e) {
                console.warn("Firestore fetch failed, using mock data:", e);
                return MOCK_LABS;
            }
        }
        return MOCK_LABS;
    },

    // Get Experiments for a specific Lab
    async getExperiments(labId) {
        if (this.isFirebaseReady()) {
            try {
                const snapshot = await window.db.collection('labs').doc(labId).collection('experiments').get();
                if (snapshot.empty) return MOCK_EXPERIMENTS[labId] || [];
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (e) {
                console.warn("Firestore fetch failed, using mock data:", e);
                return MOCK_EXPERIMENTS[labId] || [];
            }
        }
        return MOCK_EXPERIMENTS[labId] || [];
    },

    // Get Experiment Details 
    // (In a real app we might fetch individually, but here we can filter from the list or fetch doc)
    async getExperimentDetails(labId, expId) {
        // Optimization: For now just find it in the mock/fetched list
        const experiments = await this.getExperiments(labId);
        return experiments.find(e => e.id === expId);
    },

    isFirebaseReady() {
        return window.db && window.db.app;
        // Note: Even if db object exists, we should check if it's configured. 
        // For this hackathon template, we mostly rely on try/catch fallback to mock.
    }
};

window.DataProvider = DataProvider;