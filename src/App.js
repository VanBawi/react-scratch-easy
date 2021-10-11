import './App.css';
import { ScratchImage } from './lib';

function App() {
	return (
		<div className='App'>
			<ScratchImage
				// brush={'imageSrc'}
				// outerImageSrc='outerimage to be scratch'
				resetText='Rescratch'
				confirmText='Done'
				// outerImageWH=''
				// innerImageWH=''
				finishPercent={35}
				onComplete={'takes a callback'}
				confirmBtn=''
				resetBtn=''
			/>
		</div>
	);
}

export default App;
