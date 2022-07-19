import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {store} from "./reducers";
import { Provider } from "react-redux";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,

	document.getElementById("root")
);

serviceWorkerRegistration.unregister();