## 🚀 Performance

### **1. Parallel Data Fetching**

All API calls are made in parallel with `Promise.all`.

### **2. Caching**

Simple cache system to avoid unnecessary requests.

### **3. Debouncing in the Converter**

User input is debounced to avoid excessive calculations.

### **4. React Optimization**

- `useMemo` for heavy calculations
- `useCallback` for functions passed as props
- `React.memo` for components that re-render often
