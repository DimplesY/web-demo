import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';

import { Flex, Text, Button } from "@radix-ui/themes";

function MyApp() {
	return (
		<Flex direction="column" gap="9">
			<Text>Hello from Radix Themes :)</Text>
			<Button>Let's go</Button>
		</Flex>
	);
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <MyApp />
    </Theme>
  </StrictMode>,
)
