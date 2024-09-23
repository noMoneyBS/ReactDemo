import './App.css';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kitchen Helper App</h1> {/* 标题只显示一次 */}
      </header>
      <ImageUpload />
    </div>
  );
}

export default App;
