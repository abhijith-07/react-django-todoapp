import './App.css';
import { TodoForm } from './components/TodoForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const client = new QueryClient()
  return (
    <QueryClientProvider client={client}>
    <div className="App">
      <div className="container">
        <TodoForm />
      </div>
    </div>
    </QueryClientProvider>
  );
}

export default App;
