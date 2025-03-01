import {
  Alert,
  AlertIcon,
  Flex,
  Heading,
  Box
} from "@chakra-ui/react";
import { UsersTable } from "./UsersTable";

const App = () => {
  return (
    <Flex direction="column" gap={4}>
      <Heading size="lg">サンプル画面</Heading>
      <Alert status="warning">
        <AlertIcon />
        これはサンプルのコードを元にした画面です。ドキュメントを参考にして業務に沿った画面に変更してください。
      </Alert>
      <Box width="100%">
        <UsersTable />
      </Box>
    </Flex>
  );
};

export default App;
