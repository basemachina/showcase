import {
  Heading,
  Card,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Spinner,
  Flex,
  Box,
  Button
} from "@chakra-ui/react";
import { useState, useCallback } from "react";

// Mock implementations for the action hooks
// Define a type for the error
type ActionError = {
  message: string;
};

// Mock parent data
const mockParents = [
  { id: "1", name: "親カテゴリ1" },
  { id: "2", name: "親カテゴリ2" },
  { id: "3", name: "親カテゴリ3" },
];

// Mock child data generator functions
const getMockChildren1 = (parentId: string) => [
  { id: `${parentId}-1`, name: `子カテゴリ1-${parentId}` },
  { id: `${parentId}-2`, name: `子カテゴリ2-${parentId}` },
];

const getMockChildren2 = (parentId: string) => [
  { id: `${parentId}-A`, name: `子カテゴリA-${parentId}` },
  { id: `${parentId}-B`, name: `子カテゴリB-${parentId}` },
];

const App = () => {
  // Form state
  const [parentId, setParentId] = useState("");
  const [childId, setChildId] = useState("");
  const [childId2, setChildId2] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingChildren1, setLoadingChildren1] = useState(false);
  const [loadingChildren2, setLoadingChildren2] = useState(false);

  // Data states
  const [children1, setChildren1] = useState<{ id: string; name: string }[]>([]);
  const [children2, setChildren2] = useState<{ id: string; name: string }[]>([]);

  // Handle parent selection change
  const handleParentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParentId = e.target.value;
    setParentId(newParentId);

    if (newParentId) {
      // Fetch children1
      setLoadingChildren1(true);
      setTimeout(() => {
        setChildren1(getMockChildren1(newParentId));
        setLoadingChildren1(false);
      }, 500);

      // Fetch children2
      setLoadingChildren2(true);
      setTimeout(() => {
        setChildren2(getMockChildren2(newParentId));
        setLoadingChildren2(false);
      }, 500);
    } else {
      // Reset children when parent is deselected
      setChildren1([]);
      setChildren2([]);
      setChildId("");
      setChildId2("");
    }
  }, []);

  // Handle child selection changes
  const handleChild1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChildId(e.target.value);
  };

  const handleChild2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChildId2(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { parentId, childId, childId2 });
  };

  if (loading) {
    return <Box textAlign="center" py={4}><Spinner /></Box>;
  }

  return (
    <Flex direction="column" gap={2} w="full" h="full">
      <Heading size="sm">Dynamic Form</Heading>
      <Card p={4}>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={4}>
            <FormControl>
              <FormLabel>親ID</FormLabel>
              <ChakraSelect
                value={parentId}
                onChange={handleParentChange}
                placeholder="選択してください"
              >
                {mockParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>

            {parentId && (
              <>
                {loadingChildren1 ? (
                  <Box textAlign="center" py={4}>
                    <Spinner />
                  </Box>
                ) : (
                  <FormControl>
                    <FormLabel>子ID</FormLabel>
                    <ChakraSelect
                      value={childId}
                      onChange={handleChild1Change}
                      placeholder="選択してください"
                    >
                      {children1.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </ChakraSelect>
                  </FormControl>
                )}

                {loadingChildren2 ? (
                  <Box textAlign="center" py={4}>
                    <Spinner />
                  </Box>
                ) : (
                  <FormControl>
                    <FormLabel>子ID2</FormLabel>
                    <ChakraSelect
                      value={childId2}
                      onChange={handleChild2Change}
                      placeholder="選択してください"
                    >
                      {children2.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </ChakraSelect>
                  </FormControl>
                )}
              </>
            )}

            <Button type="submit" colorScheme="blue" alignSelf="flex-end" mt={2}>
              送信
            </Button>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default App;
