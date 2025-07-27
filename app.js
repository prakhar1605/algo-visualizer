// DSA Visualizer JavaScript
class DSAVisualizer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentSpeed = 200;
        this.arraySize = 50;
        this.array = [];
        this.searchArray = [];
        this.grid = [];
        this.gridSize = 25;
        this.startNode = null;
        this.endNode = null;
        this.tree = null;
        this.stack = [];
        this.queue = [];
        this.linkedList = [];
        
        this.algorithmData = {
            sorting: {
                bubble: { name: "Bubble Sort", time: "O(n²)", space: "O(1)", desc: "Compares adjacent elements and swaps them if they're in wrong order" },
                selection: { name: "Selection Sort", time: "O(n²)", space: "O(1)", desc: "Finds minimum element and places it at the beginning" },
                insertion: { name: "Insertion Sort", time: "O(n²)", space: "O(1)", desc: "Builds sorted array one element at a time" },
                merge: { name: "Merge Sort", time: "O(n log n)", space: "O(n)", desc: "Divide and conquer algorithm that splits array and merges sorted halves" },
                quick: { name: "Quick Sort", time: "O(n log n)", space: "O(log n)", desc: "Picks pivot element and partitions array around it" },
                heap: { name: "Heap Sort", time: "O(n log n)", space: "O(1)", desc: "Uses heap data structure to sort elements" }
            },
            search: {
                linear: { name: "Linear Search", time: "O(n)", space: "O(1)", desc: "Searches each element sequentially until target is found" },
                binary: { name: "Binary Search", time: "O(log n)", space: "O(1)", desc: "Searches sorted array by repeatedly dividing search interval in half" }
            },
            graph: {
                bfs: { name: "Breadth-First Search", time: "O(V + E)", space: "O(V)", desc: "Explores neighbors before going deeper, uses queue" },
                dfs: { name: "Depth-First Search", time: "O(V + E)", space: "O(V)", desc: "Explores as far as possible before backtracking, uses stack" },
                dijkstra: { name: "Dijkstra's Algorithm", time: "O(V²)", space: "O(V)", desc: "Finds shortest path in weighted graph" },
                astar: { name: "A* Algorithm", time: "O(b^d)", space: "O(b^d)", desc: "Uses heuristic to find optimal path faster than Dijkstra" }
            },
            tree: {
                inorder: { name: "Inorder Traversal", time: "O(n)", space: "O(h)", desc: "Left → Root → Right traversal" },
                preorder: { name: "Preorder Traversal", time: "O(n)", space: "O(h)", desc: "Root → Left → Right traversal" },
                postorder: { name: "Postorder Traversal", time: "O(n)", space: "O(h)", desc: "Left → Right → Root traversal" },
                levelorder: { name: "Level Order Traversal", time: "O(n)", space: "O(w)", desc: "Breadth-first traversal using queue" }
            }
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSorting();
        this.setupSearch();
        this.setupGraph();
        this.setupTree();
        this.setupDataStructures();
        this.generateArray();
        this.generateSearchArray();
        this.initializeGrid();
        this.generateSampleTree();
        
        // Initialize algorithm info displays
        this.updateAlgorithmInfo('sorting', 'bubble');
        this.updateAlgorithmInfo('search', 'linear');
        this.updateAlgorithmInfo('graph', 'bfs');
        this.updateAlgorithmInfo('tree', 'inorder');
    }

    // Navigation
    setupNavigation() {
        const tabs = document.querySelectorAll('.nav__tab');
        const sections = document.querySelectorAll('.section');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetSection = tab.dataset.tab;
                console.log('Switching to section:', targetSection);
                
                // Remove active class from all tabs and sections
                tabs.forEach(t => t.classList.remove('nav__tab--active'));
                sections.forEach(s => s.classList.remove('section--active'));
                
                // Add active class to clicked tab and corresponding section
                tab.classList.add('nav__tab--active');
                const targetSectionElement = document.getElementById(targetSection);
                if (targetSectionElement) {
                    targetSectionElement.classList.add('section--active');
                }
            });
        });
    }

    // Sorting Algorithms
    setupSorting() {
        const sortingSelect = document.getElementById('sortingSelect');
        if (sortingSelect) {
            sortingSelect.addEventListener('change', (e) => {
                this.updateAlgorithmInfo('sorting', e.target.value);
            });
        }

        const sortSpeed = document.getElementById('sortSpeed');
        if (sortSpeed) {
            sortSpeed.addEventListener('input', (e) => {
                this.currentSpeed = 400 - (e.target.value * 35);
            });
        }

        const arraySize = document.getElementById('arraySize');
        if (arraySize) {
            arraySize.addEventListener('input', (e) => {
                this.arraySize = parseInt(e.target.value);
                this.generateArray();
            });
        }

        const generateArrayBtn = document.getElementById('generateArray');
        if (generateArrayBtn) {
            generateArrayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateArray();
            });
        }

        const startSortBtn = document.getElementById('startSort');
        if (startSortBtn) {
            startSortBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startSorting();
            });
        }

        const pauseSortBtn = document.getElementById('pauseSort');
        if (pauseSortBtn) {
            pauseSortBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.isPaused = !this.isPaused;
                pauseSortBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
            });
        }

        const resetSortBtn = document.getElementById('resetSort');
        if (resetSortBtn) {
            resetSortBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetSort();
            });
        }
    }

    generateArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 280) + 10);
        }
        this.renderArray();
    }

    renderArray() {
        const container = document.getElementById('arrayContainer');
        if (!container) return;
        
        container.innerHTML = '';
        const maxWidth = Math.max(800 / this.arraySize - 2, 8);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value}px`;
            bar.style.width = `${maxWidth}px`;
            bar.textContent = this.arraySize <= 50 ? value : '';
            bar.dataset.index = index;
            container.appendChild(bar);
        });
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        const sortingSelect = document.getElementById('sortingSelect');
        const algorithm = sortingSelect ? sortingSelect.value : 'bubble';
        
        // Update button states
        const startBtn = document.getElementById('startSort');
        const pauseBtn = document.getElementById('pauseSort');
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        
        try {
            switch (algorithm) {
                case 'bubble': await this.bubbleSort(); break;
                case 'selection': await this.selectionSort(); break;
                case 'insertion': await this.insertionSort(); break;
                case 'merge': await this.mergeSort(0, this.array.length - 1); break;
                case 'quick': await this.quickSort(0, this.array.length - 1); break;
                case 'heap': await this.heapSort(); break;
            }
        } catch (error) {
            console.error('Sorting error:', error);
        }
        
        this.markAllSorted();
        this.isRunning = false;
        
        // Reset button states
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) {
            pauseBtn.disabled = true;
            pauseBtn.textContent = 'Pause';
        }
    }

    async bubbleSort() {
        const bars = document.querySelectorAll('.array-bar');
        
        for (let i = 0; i < this.array.length - 1; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                await this.waitForPause();
                
                this.highlightBars([j, j + 1], 'comparing');
                await this.sleep(this.currentSpeed);
                
                if (this.array[j] > this.array[j + 1]) {
                    this.highlightBars([j, j + 1], 'swapping');
                    await this.sleep(this.currentSpeed);
                    
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.updateBars([j, j + 1]);
                }
                
                this.clearHighlight([j, j + 1]);
            }
            if (bars[this.array.length - 1 - i]) {
                bars[this.array.length - 1 - i].classList.add('array-bar--sorted');
            }
        }
        if (bars[0]) {
            bars[0].classList.add('array-bar--sorted');
        }
    }

    async selectionSort() {
        const bars = document.querySelectorAll('.array-bar');
        
        for (let i = 0; i < this.array.length - 1; i++) {
            let minIdx = i;
            
            for (let j = i + 1; j < this.array.length; j++) {
                await this.waitForPause();
                
                this.highlightBars([j, minIdx], 'comparing');
                await this.sleep(this.currentSpeed);
                
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
                
                this.clearHighlight([j]);
            }
            
            if (minIdx !== i) {
                this.highlightBars([i, minIdx], 'swapping');
                await this.sleep(this.currentSpeed);
                
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.updateBars([i, minIdx]);
            }
            
            this.clearHighlight([i, minIdx]);
            if (bars[i]) {
                bars[i].classList.add('array-bar--sorted');
            }
        }
        if (bars[this.array.length - 1]) {
            bars[this.array.length - 1].classList.add('array-bar--sorted');
        }
    }

    async insertionSort() {
        const bars = document.querySelectorAll('.array-bar');
        if (bars[0]) {
            bars[0].classList.add('array-bar--sorted');
        }
        
        for (let i = 1; i < this.array.length; i++) {
            let key = this.array[i];
            let j = i - 1;
            
            this.highlightBars([i], 'comparing');
            await this.sleep(this.currentSpeed);
            
            while (j >= 0 && this.array[j] > key) {
                await this.waitForPause();
                
                this.highlightBars([j, j + 1], 'swapping');
                await this.sleep(this.currentSpeed);
                
                this.array[j + 1] = this.array[j];
                this.updateBars([j + 1]);
                j--;
            }
            
            this.array[j + 1] = key;
            this.updateBars([j + 1]);
            this.clearHighlight([i, j + 1]);
            if (bars[i]) {
                bars[i].classList.add('array-bar--sorted');
            }
        }
    }

    async mergeSort(left, right) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        await this.mergeSort(left, mid);
        await this.mergeSort(mid + 1, right);
        await this.merge(left, mid, right);
    }

    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            await this.waitForPause();
            
            this.highlightBars([k], 'comparing');
            await this.sleep(this.currentSpeed);
            
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            this.updateBars([k]);
            this.clearHighlight([k]);
            k++;
        }
        
        while (i < leftArr.length) {
            this.array[k] = leftArr[i];
            this.updateBars([k]);
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            this.array[k] = rightArr[j];
            this.updateBars([k]);
            j++;
            k++;
        }
    }

    async quickSort(low, high) {
        if (low < high) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            await this.waitForPause();
            
            this.highlightBars([j, high], 'comparing');
            await this.sleep(this.currentSpeed);
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    this.highlightBars([i, j], 'swapping');
                    await this.sleep(this.currentSpeed);
                    
                    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                    this.updateBars([i, j]);
                }
            }
            
            this.clearHighlight([j, high, i]);
        }
        
        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.updateBars([i + 1, high]);
        
        return i + 1;
    }

    async heapSort() {
        // Build max heap
        for (let i = Math.floor(this.array.length / 2) - 1; i >= 0; i--) {
            await this.heapify(this.array.length, i);
        }
        
        // Extract elements from heap one by one
        for (let i = this.array.length - 1; i > 0; i--) {
            await this.waitForPause();
            
            this.highlightBars([0, i], 'swapping');
            await this.sleep(this.currentSpeed);
            
            [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
            this.updateBars([0, i]);
            
            const bars = document.querySelectorAll('.array-bar');
            if (bars[i]) {
                bars[i].classList.add('array-bar--sorted');
            }
            
            await this.heapify(i, 0);
            this.clearHighlight([0, i]);
        }
        
        const bars = document.querySelectorAll('.array-bar');
        if (bars[0]) {
            bars[0].classList.add('array-bar--sorted');
        }
    }

    async heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < n && this.array[left] > this.array[largest]) {
            largest = left;
        }
        
        if (right < n && this.array[right] > this.array[largest]) {
            largest = right;
        }
        
        if (largest !== i) {
            this.highlightBars([i, largest], 'swapping');
            await this.sleep(this.currentSpeed);
            
            [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
            this.updateBars([i, largest]);
            
            this.clearHighlight([i, largest]);
            await this.heapify(n, largest);
        }
    }

    highlightBars(indices, type) {
        indices.forEach(index => {
            const bar = document.querySelector(`[data-index="${index}"]`);
            if (bar) {
                bar.classList.remove('array-bar--comparing', 'array-bar--swapping');
                bar.classList.add(`array-bar--${type}`);
            }
        });
    }

    clearHighlight(indices) {
        indices.forEach(index => {
            const bar = document.querySelector(`[data-index="${index}"]`);
            if (bar) {
                bar.classList.remove('array-bar--comparing', 'array-bar--swapping');
            }
        });
    }

    updateBars(indices) {
        indices.forEach(index => {
            const bar = document.querySelector(`[data-index="${index}"]`);
            if (bar) {
                bar.style.height = `${this.array[index]}px`;
                bar.textContent = this.arraySize <= 50 ? this.array[index] : '';
            }
        });
    }

    markAllSorted() {
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => bar.classList.add('array-bar--sorted'));
    }

    resetSort() {
        this.isRunning = false;
        this.isPaused = false;
        const pauseBtn = document.getElementById('pauseSort');
        if (pauseBtn) {
            pauseBtn.textContent = 'Pause';
            pauseBtn.disabled = true;
        }
        const startBtn = document.getElementById('startSort');
        if (startBtn) {
            startBtn.disabled = false;
        }
        this.generateArray();
    }

    // Search Algorithms
    setupSearch() {
        const searchSelect = document.getElementById('searchSelect');
        if (searchSelect) {
            searchSelect.addEventListener('change', (e) => {
                this.updateAlgorithmInfo('search', e.target.value);
                this.generateSearchArray(); // Regenerate array when algorithm changes
            });
        }

        const generateSearchArrayBtn = document.getElementById('generateSearchArray');
        if (generateSearchArrayBtn) {
            generateSearchArrayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateSearchArray();
            });
        }

        const startSearchBtn = document.getElementById('startSearch');
        if (startSearchBtn) {
            startSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startSearch();
            });
        }

        const resetSearchBtn = document.getElementById('resetSearch');
        if (resetSearchBtn) {
            resetSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetSearch();
            });
        }
    }

    generateSearchArray() {
        this.searchArray = [];
        for (let i = 0; i < 20; i++) {
            this.searchArray.push(Math.floor(Math.random() * 100) + 1);
        }
        
        // Sort for binary search
        const searchSelect = document.getElementById('searchSelect');
        if (searchSelect && searchSelect.value === 'binary') {
            this.searchArray.sort((a, b) => a - b);
        }
        
        this.renderSearchArray();
        this.resetSearch(); // Clear any previous results
    }

    renderSearchArray() {
        const container = document.getElementById('searchContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.searchArray.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'search-element';
            element.textContent = value;
            element.dataset.index = index;
            container.appendChild(element);
        });
    }

    async startSearch() {
        const targetInput = document.getElementById('targetValue');
        if (!targetInput) return;
        
        const target = parseInt(targetInput.value);
        if (isNaN(target)) {
            alert('Please enter a valid target value');
            return;
        }

        this.clearSearchHighlights();
        const resultDiv = document.getElementById('searchResult');
        if (resultDiv) {
            resultDiv.innerHTML = '';
            resultDiv.className = 'search-result';
        }
        
        const searchSelect = document.getElementById('searchSelect');
        const algorithm = searchSelect ? searchSelect.value : 'linear';
        let result = -1;
        
        if (algorithm === 'linear') {
            result = await this.linearSearch(target);
        } else {
            // Sort array for binary search if not already sorted
            this.searchArray.sort((a, b) => a - b);
            this.renderSearchArray();
            await this.sleep(500);
            result = await this.binarySearch(target);
        }
        
        this.showSearchResult(result, target);
    }

    async linearSearch(target) {
        const elements = document.querySelectorAll('.search-element');
        
        for (let i = 0; i < this.searchArray.length; i++) {
            if (elements[i]) {
                elements[i].classList.add('search-element--current');
                await this.sleep(300);
                
                if (this.searchArray[i] === target) {
                    elements[i].classList.remove('search-element--current');
                    elements[i].classList.add('search-element--found');
                    return i;
                }
                
                elements[i].classList.remove('search-element--current');
                elements[i].classList.add('search-element--checked');
            }
        }
        
        return -1;
    }

    async binarySearch(target) {
        const elements = document.querySelectorAll('.search-element');
        let left = 0;
        let right = this.searchArray.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (elements[mid]) {
                elements[mid].classList.add('search-element--current');
                await this.sleep(500);
                
                if (this.searchArray[mid] === target) {
                    elements[mid].classList.remove('search-element--current');
                    elements[mid].classList.add('search-element--found');
                    return mid;
                }
                
                elements[mid].classList.remove('search-element--current');
                elements[mid].classList.add('search-element--checked');
                
                if (this.searchArray[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        
        return -1;
    }

    clearSearchHighlights() {
        const elements = document.querySelectorAll('.search-element');
        elements.forEach(el => {
            el.classList.remove('search-element--current', 'search-element--found', 'search-element--checked');
        });
    }

    showSearchResult(index, target) {
        const resultDiv = document.getElementById('searchResult');
        if (!resultDiv) return;
        
        if (index !== -1) {
            resultDiv.innerHTML = `Found ${target} at index ${index}`;
            resultDiv.className = 'search-result search-result--found';
        } else {
            resultDiv.innerHTML = `${target} not found in array`;
            resultDiv.className = 'search-result search-result--not-found';
        }
    }

    resetSearch() {
        this.clearSearchHighlights();
        const resultDiv = document.getElementById('searchResult');
        if (resultDiv) {
            resultDiv.innerHTML = '';
            resultDiv.className = 'search-result';
        }
    }

    // Graph Algorithms
    setupGraph() {
        const graphSelect = document.getElementById('graphSelect');
        if (graphSelect) {
            graphSelect.addEventListener('change', (e) => {
                this.updateAlgorithmInfo('graph', e.target.value);
            });
        }

        const startPathfindingBtn = document.getElementById('startPathfinding');
        if (startPathfindingBtn) {
            startPathfindingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startPathfinding();
            });
        }

        const clearGridBtn = document.getElementById('clearGrid');
        if (clearGridBtn) {
            clearGridBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearGrid();
            });
        }

        const generateMazeBtn = document.getElementById('generateMaze');
        if (generateMazeBtn) {
            generateMazeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateMaze();
            });
        }
    }

    initializeGrid() {
        this.grid = [];
        const container = document.getElementById('gridContainer');
        if (!container) return;
        
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Set start and end nodes
                if (row === 5 && col === 5) {
                    cell.classList.add('grid-cell--start');
                    this.startNode = { row, col };
                } else if (row === 15 && col === 15) {
                    cell.classList.add('grid-cell--end');
                    this.endNode = { row, col };
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                container.appendChild(cell);
                this.grid[row][col] = { row, col, isWall: false, isVisited: false };
            }
        }
    }

    handleCellClick(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;
        
        if (cell.classList.contains('grid-cell--start') || cell.classList.contains('grid-cell--end')) {
            return;
        }
        
        if (cell.classList.contains('grid-cell--wall')) {
            cell.classList.remove('grid-cell--wall');
            this.grid[row][col].isWall = false;
        } else {
            cell.classList.add('grid-cell--wall');
            this.grid[row][col].isWall = true;
        }
    }

    async startPathfinding() {
        this.clearPath();
        const graphSelect = document.getElementById('graphSelect');
        const algorithm = graphSelect ? graphSelect.value : 'bfs';
        
        switch (algorithm) {
            case 'bfs': await this.bfs(); break;
            case 'dfs': await this.dfs(); break;
            case 'dijkstra': await this.dijkstra(); break;
            case 'astar': await this.aStar(); break;
        }
    }

    async bfs() {
        const queue = [this.startNode];
        const visited = new Set();
        const parent = new Map();
        
        visited.add(`${this.startNode.row}-${this.startNode.col}`);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.row === this.endNode.row && current.col === this.endNode.col) {
                await this.reconstructPath(parent, current);
                return;
            }
            
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                const key = `${neighbor.row}-${neighbor.col}`;
                
                if (!visited.has(key) && !this.grid[neighbor.row][neighbor.col].isWall) {
                    visited.add(key);
                    parent.set(key, current);
                    queue.push(neighbor);
                    
                    if (neighbor.row !== this.endNode.row || neighbor.col !== this.endNode.col) {
                        const cell = document.querySelector(`[data-row="${neighbor.row}"][data-col="${neighbor.col}"]`);
                        if (cell) {
                            cell.classList.add('grid-cell--visited');
                            await this.sleep(50);
                        }
                    }
                }
            }
        }
    }

    async dfs() {
        const stack = [this.startNode];
        const visited = new Set();
        const parent = new Map();
        
        while (stack.length > 0) {
            const current = stack.pop();
            const key = `${current.row}-${current.col}`;
            
            if (visited.has(key)) continue;
            
            visited.add(key);
            
            if (current.row === this.endNode.row && current.col === this.endNode.col) {
                await this.reconstructPath(parent, current);
                return;
            }
            
            if (current.row !== this.startNode.row || current.col !== this.startNode.col) {
                const cell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
                if (cell) {
                    cell.classList.add('grid-cell--visited');
                    await this.sleep(50);
                }
            }
            
            const neighbors = this.getNeighbors(current).reverse();
            
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row}-${neighbor.col}`;
                
                if (!visited.has(neighborKey) && !this.grid[neighbor.row][neighbor.col].isWall) {
                    parent.set(neighborKey, current);
                    stack.push(neighbor);
                }
            }
        }
    }

    async dijkstra() {
        const distances = new Map();
        const visited = new Set();
        const parent = new Map();
        const queue = [];
        
        // Initialize distances
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                distances.set(`${row}-${col}`, Infinity);
            }
        }
        
        const startKey = `${this.startNode.row}-${this.startNode.col}`;
        distances.set(startKey, 0);
        queue.push({ ...this.startNode, distance: 0 });
        
        while (queue.length > 0) {
            // Get node with minimum distance
            queue.sort((a, b) => a.distance - b.distance);
            const current = queue.shift();
            const currentKey = `${current.row}-${current.col}`;
            
            if (visited.has(currentKey)) continue;
            visited.add(currentKey);
            
            if (current.row === this.endNode.row && current.col === this.endNode.col) {
                await this.reconstructPath(parent, current);
                return;
            }
            
            if (current.row !== this.startNode.row || current.col !== this.startNode.col) {
                const cell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
                if (cell) {
                    cell.classList.add('grid-cell--visited');
                    await this.sleep(50);
                }
            }
            
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row}-${neighbor.col}`;
                
                if (!visited.has(neighborKey) && !this.grid[neighbor.row][neighbor.col].isWall) {
                    const newDistance = distances.get(currentKey) + 1;
                    
                    if (newDistance < distances.get(neighborKey)) {
                        distances.set(neighborKey, newDistance);
                        parent.set(neighborKey, current);
                        queue.push({ ...neighbor, distance: newDistance });
                    }
                }
            }
        }
    }

    async aStar() {
        const gScore = new Map();
        const fScore = new Map();
        const openSet = [];
        const closedSet = new Set();
        const parent = new Map();
        
        const startKey = `${this.startNode.row}-${this.startNode.col}`;
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(this.startNode, this.endNode));
        openSet.push({ ...this.startNode, f: fScore.get(startKey) });
        
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();
            const currentKey = `${current.row}-${current.col}`;
            
            if (current.row === this.endNode.row && current.col === this.endNode.col) {
                await this.reconstructPath(parent, current);
                return;
            }
            
            closedSet.add(currentKey);
            
            if (current.row !== this.startNode.row || current.col !== this.startNode.col) {
                const cell = document.querySelector(`[data-row="${current.row}"][data-col="${current.col}"]`);
                if (cell) {
                    cell.classList.add('grid-cell--visited');
                    await this.sleep(50);
                }
            }
            
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.row}-${neighbor.col}`;
                
                if (closedSet.has(neighborKey) || this.grid[neighbor.row][neighbor.col].isWall) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(currentKey) + 1;
                
                if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                    parent.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeGScore);
                    fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, this.endNode));
                    
                    if (!openSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
                        openSet.push({ ...neighbor, f: fScore.get(neighborKey) });
                    }
                }
            }
        }
    }

    heuristic(node1, node2) {
        return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
    }

    getNeighbors(node) {
        const neighbors = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dRow, dCol] of directions) {
            const newRow = node.row + dRow;
            const newCol = node.col + dCol;
            
            if (newRow >= 0 && newRow < this.gridSize && newCol >= 0 && newCol < this.gridSize) {
                neighbors.push({ row: newRow, col: newCol });
            }
        }
        
        return neighbors;
    }

    async reconstructPath(parent, endNode) {
        const path = [];
        let current = endNode;
        
        while (current) {
            path.unshift(current);
            const key = `${current.row}-${current.col}`;
            current = parent.get(key);
        }
        
        for (let i = 1; i < path.length - 1; i++) {
            const cell = document.querySelector(`[data-row="${path[i].row}"][data-col="${path[i].col}"]`);
            if (cell) {
                cell.classList.add('grid-cell--path');
                await this.sleep(100);
            }
        }
    }

    clearPath() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('grid-cell--visited', 'grid-cell--path');
        });
    }

    clearGrid() {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('grid-cell--wall', 'grid-cell--visited', 'grid-cell--path');
        });
        
        if (this.grid) {
            this.grid.forEach(row => {
                if (row) {
                    row.forEach(cell => {
                        if (cell) {
                            cell.isWall = false;
                            cell.isVisited = false;
                        }
                    });
                }
            });
        }
    }

    generateMaze() {
        this.clearGrid();
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (Math.random() < 0.3 && 
                    !(row === this.startNode.row && col === this.startNode.col) &&
                    !(row === this.endNode.row && col === this.endNode.col)) {
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.classList.add('grid-cell--wall');
                        this.grid[row][col].isWall = true;
                    }
                }
            }
        }
    }

    // Tree Algorithms
    setupTree() {
        const treeSelect = document.getElementById('treeSelect');
        if (treeSelect) {
            treeSelect.addEventListener('change', (e) => {
                this.updateAlgorithmInfo('tree', e.target.value);
            });
        }

        const addNodeBtn = document.getElementById('addNode');
        if (addNodeBtn) {
            addNodeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const nodeValueInput = document.getElementById('nodeValue');
                if (nodeValueInput) {
                    const value = parseInt(nodeValueInput.value);
                    if (!isNaN(value)) {
                        this.addTreeNode(value);
                        nodeValueInput.value = '';
                    }
                }
            });
        }

        const startTraversalBtn = document.getElementById('startTraversal');
        if (startTraversalBtn) {
            startTraversalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startTreeTraversal();
            });
        }

        const generateTreeBtn = document.getElementById('generateTree');
        if (generateTreeBtn) {
            generateTreeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.generateSampleTree();
            });
        }

        const clearTreeBtn = document.getElementById('clearTree');
        if (clearTreeBtn) {
            clearTreeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearTreeVisualization();
            });
        }
    }

    generateSampleTree() {
        this.tree = new TreeNode(50);
        const values = [30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
        values.forEach(val => this.insertNode(this.tree, val));
        this.renderTree();
    }

    addTreeNode(value) {
        if (!this.tree) {
            this.tree = new TreeNode(value);
        } else {
            this.insertNode(this.tree, value);
        }
        this.renderTree();
    }

    insertNode(root, value) {
        if (value < root.value) {
            if (root.left === null) {
                root.left = new TreeNode(value);
            } else {
                this.insertNode(root.left, value);
            }
        } else if (value > root.value) {
            if (root.right === null) {
                root.right = new TreeNode(value);
            } else {
                this.insertNode(root.right, value);
            }
        }
    }

    renderTree() {
        const svg = document.getElementById('treeSvg');
        if (!svg) return;
        
        svg.innerHTML = '';
        
        if (!this.tree) return;
        
        const positions = this.calculateNodePositions(this.tree, 400, 50, 200);
        this.drawTree(svg, this.tree, positions);
    }

    calculateNodePositions(node, x, y, spacing) {
        const positions = new Map();
        
        const calculate = (node, x, y, spacing) => {
            if (!node) return;
            
            positions.set(node, { x, y });
            
            if (node.left) {
                calculate(node.left, x - spacing, y + 80, spacing / 2);
            }
            if (node.right) {
                calculate(node.right, x + spacing, y + 80, spacing / 2);
            }
        };
        
        calculate(node, x, y, spacing);
        return positions;
    }

    drawTree(svg, node, positions) {
        const drawNode = (node) => {
            if (!node) return;
            
            const pos = positions.get(node);
            
            // Draw edges first
            if (node.left) {
                const leftPos = positions.get(node.left);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', pos.x);
                line.setAttribute('y1', pos.y);
                line.setAttribute('x2', leftPos.x);
                line.setAttribute('y2', leftPos.y);
                line.setAttribute('class', 'tree-edge');
                svg.appendChild(line);
            }
            
            if (node.right) {
                const rightPos = positions.get(node.right);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', pos.x);
                line.setAttribute('y1', pos.y);
                line.setAttribute('x2', rightPos.x);
                line.setAttribute('y2', rightPos.y);
                line.setAttribute('class', 'tree-edge');
                svg.appendChild(line);
            }
            
            drawNode(node.left);
            drawNode(node.right);
        };
        
        drawNode(node);
        
        // Draw nodes on top
        const drawNodes = (node) => {
            if (!node) return;
            
            const pos = positions.get(node);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 20);
            circle.setAttribute('class', 'tree-node');
            circle.setAttribute('data-value', node.value);
            svg.appendChild(circle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y);
            text.setAttribute('class', 'tree-text');
            text.textContent = node.value;
            svg.appendChild(text);
            
            drawNodes(node.left);
            drawNodes(node.right);
        };
        
        drawNodes(node);
    }

    async startTreeTraversal() {
        if (!this.tree) return;
        
        this.clearTreeHighlight();
        const traversalSequenceDiv = document.getElementById('traversalSequence');
        if (traversalSequenceDiv) {
            traversalSequenceDiv.innerHTML = '';
        }
        
        const treeSelect = document.getElementById('treeSelect');
        const algorithm = treeSelect ? treeSelect.value : 'inorder';
        const sequence = [];
        
        switch (algorithm) {
            case 'inorder':
                await this.inorderTraversal(this.tree, sequence);
                break;
            case 'preorder':
                await this.preorderTraversal(this.tree, sequence);
                break;
            case 'postorder':
                await this.postorderTraversal(this.tree, sequence);
                break;
            case 'levelorder':
                await this.levelOrderTraversal(this.tree, sequence);
                break;
        }
        
        if (traversalSequenceDiv) {
            traversalSequenceDiv.innerHTML = `Traversal sequence: ${sequence.join(' → ')}`;
        }
    }

    async inorderTraversal(node, sequence) {
        if (!node) return;
        
        await this.inorderTraversal(node.left, sequence);
        await this.highlightTreeNode(node, sequence);
        await this.inorderTraversal(node.right, sequence);
    }

    async preorderTraversal(node, sequence) {
        if (!node) return;
        
        await this.highlightTreeNode(node, sequence);
        await this.preorderTraversal(node.left, sequence);
        await this.preorderTraversal(node.right, sequence);
    }

    async postorderTraversal(node, sequence) {
        if (!node) return;
        
        await this.postorderTraversal(node.left, sequence);
        await this.postorderTraversal(node.right, sequence);
        await this.highlightTreeNode(node, sequence);
    }

    async levelOrderTraversal(root, sequence) {
        if (!root) return;
        
        const queue = [root];
        
        while (queue.length > 0) {
            const node = queue.shift();
            await this.highlightTreeNode(node, sequence);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }

    async highlightTreeNode(node, sequence) {
        const circle = document.querySelector(`[data-value="${node.value}"]`);
        if (circle) {
            circle.classList.add('tree-node--current');
            await this.sleep(800);
            
            sequence.push(node.value);
            const traversalSequenceDiv = document.getElementById('traversalSequence');
            if (traversalSequenceDiv) {
                traversalSequenceDiv.innerHTML = `Current sequence: ${sequence.join(' → ')}`;
            }
            
            circle.classList.remove('tree-node--current');
            circle.classList.add('tree-node--visited');
        }
    }

    clearTreeHighlight() {
        const nodes = document.querySelectorAll('.tree-node');
        nodes.forEach(node => {
            node.classList.remove('tree-node--current', 'tree-node--visited');
        });
    }

    clearTreeVisualization() {
        this.tree = null;
        const svg = document.getElementById('treeSvg');
        if (svg) {
            svg.innerHTML = '';
        }
        const traversalSequenceDiv = document.getElementById('traversalSequence');
        if (traversalSequenceDiv) {
            traversalSequenceDiv.innerHTML = '';
        }
    }

    // Data Structures
    setupDataStructures() {
        // Stack
        const stackPushBtn = document.getElementById('stackPush');
        if (stackPushBtn) {
            stackPushBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const stackValueInput = document.getElementById('stackValue');
                if (stackValueInput) {
                    const value = parseInt(stackValueInput.value);
                    if (!isNaN(value)) {
                        this.pushStack(value);
                        stackValueInput.value = '';
                    }
                }
            });
        }

        const stackPopBtn = document.getElementById('stackPop');
        if (stackPopBtn) {
            stackPopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.popStack();
            });
        }

        const stackClearBtn = document.getElementById('stackClear');
        if (stackClearBtn) {
            stackClearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearStack();
            });
        }

        // Queue
        const queueEnqueueBtn = document.getElementById('queueEnqueue');
        if (queueEnqueueBtn) {
            queueEnqueueBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const queueValueInput = document.getElementById('queueValue');
                if (queueValueInput) {
                    const value = parseInt(queueValueInput.value);
                    if (!isNaN(value)) {
                        this.enqueue(value);
                        queueValueInput.value = '';
                    }
                }
            });
        }

        const queueDequeueBtn = document.getElementById('queueDequeue');
        if (queueDequeueBtn) {
            queueDequeueBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dequeue();
            });
        }

        const queueClearBtn = document.getElementById('queueClear');
        if (queueClearBtn) {
            queueClearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearQueue();
            });
        }

        // Linked List
        const listInsertBtn = document.getElementById('listInsert');
        if (listInsertBtn) {
            listInsertBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const listValueInput = document.getElementById('listValue');
                if (listValueInput) {
                    const value = parseInt(listValueInput.value);
                    if (!isNaN(value)) {
                        this.insertLinkedList(value);
                        listValueInput.value = '';
                    }
                }
            });
        }

        const listDeleteBtn = document.getElementById('listDelete');
        if (listDeleteBtn) {
            listDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const listValueInput = document.getElementById('listValue');
                if (listValueInput) {
                    const value = parseInt(listValueInput.value);
                    if (!isNaN(value)) {
                        this.deleteLinkedList(value);
                        listValueInput.value = '';
                    }
                }
            });
        }

        const listClearBtn = document.getElementById('listClear');
        if (listClearBtn) {
            listClearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.clearLinkedList();
            });
        }
    }

    pushStack(value) {
        this.stack.push(value);
        this.renderStack();
    }

    popStack() {
        if (this.stack.length > 0) {
            this.stack.pop();
            this.renderStack();
        }
    }

    clearStack() {
        this.stack = [];
        this.renderStack();
    }

    renderStack() {
        const container = document.getElementById('stackContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.stack.forEach(value => {
            const item = document.createElement('div');
            item.className = 'stack-item';
            item.textContent = value;
            container.appendChild(item);
        });
    }

    enqueue(value) {
        this.queue.push(value);
        this.renderQueue();
    }

    dequeue() {
        if (this.queue.length > 0) {
            this.queue.shift();
            this.renderQueue();
        }
    }

    clearQueue() {
        this.queue = [];
        this.renderQueue();
    }

    renderQueue() {
        const container = document.getElementById('queueContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.queue.forEach(value => {
            const item = document.createElement('div');
            item.className = 'queue-item';
            item.textContent = value;
            container.appendChild(item);
        });
    }

    insertLinkedList(value) {
        this.linkedList.push(value);
        this.renderLinkedList();
    }

    deleteLinkedList(value) {
        const index = this.linkedList.indexOf(value);
        if (index !== -1) {
            this.linkedList.splice(index, 1);
            this.renderLinkedList();
        }
    }

    clearLinkedList() {
        this.linkedList = [];
        this.renderLinkedList();
    }

    renderLinkedList() {
        const container = document.getElementById('listContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.linkedList.forEach((value, index) => {
            const node = document.createElement('div');
            node.className = 'list-node';
            
            const item = document.createElement('div');
            item.className = 'list-item';
            item.textContent = value;
            node.appendChild(item);
            
            if (index < this.linkedList.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'list-arrow';
                node.appendChild(arrow);
            }
            
            container.appendChild(node);
        });
    }

    // Utility Functions
    updateAlgorithmInfo(category, algorithm) {
        const info = this.algorithmData[category][algorithm];
        const infoDiv = document.getElementById(`${category}Info`);
        
        if (info && infoDiv) {
            infoDiv.innerHTML = `
                <div class="info-card">
                    <h3>${info.name}</h3>
                    <p>Time: ${info.time} | Space: ${info.space}</p>
                    <p>${info.desc}</p>
                </div>
            `;
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async waitForPause() {
        while (this.isPaused) {
            await this.sleep(100);
        }
    }
}

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DSAVisualizer();
});