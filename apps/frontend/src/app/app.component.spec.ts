import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';

test('renders', async () => {
  await render(AppComponent);
});
