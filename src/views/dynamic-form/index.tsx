import { useFormikContext, Formik, Form, Field, FieldProps } from "formik";
import {
  Heading,
  Card,
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  Spinner,
  Flex,
  Box
} from "@chakra-ui/react";
import { useState, useCallback } from "react";

// Mock implementations for the action hooks
// Define a type for the error
type ActionError = {
  message: string;
};

const useExecuteAction = (actionName: string) => {
  // Mock data for the "get-parents" action
  const mockParents = [
    { id: "1", name: "親カテゴリ1" },
    { id: "2", name: "親カテゴリ2" },
    { id: "3", name: "親カテゴリ3" },
  ];

  return {
    data: {
      results: [{ success: mockParents }]
    },
    loading: false,
    error: null as ActionError | null
  };
};

const useExecuteActionLazy = (actionName: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const execute = (params: any) => {
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock data based on the action name
      if (actionName === "get-children-1") {
        setData({
          results: [{
            success: [
              { id: `${params.id}-1`, name: `子カテゴリ1-${params.id}` },
              { id: `${params.id}-2`, name: `子カテゴリ2-${params.id}` },
            ]
          }]
        });
      } else if (actionName === "get-children-2") {
        setData({
          results: [{
            success: [
              { id: `${params.id}-A`, name: `子カテゴリA-${params.id}` },
              { id: `${params.id}-B`, name: `子カテゴリB-${params.id}` },
            ]
          }]
        });
      }

      setLoading(false);
    }, 500);
  };

  return [execute, { data, loading, error: null as ActionError | null }] as const;
};

type DynamicFormContentProps = {
  parents: {
    id: string;
    name: string;
  }[];
};

type DynamicFormValues = {
  parentId: string;
  childId: string;
  childId2: string;
};

const DynamicFormContent = ({
  parents,
}: DynamicFormContentProps) => {
  const { values } = useFormikContext<DynamicFormValues>();
  const [fetchChilds, fetchChildsResult] = useExecuteActionLazy("get-children-1");
  const [fetchChilds2, fetchChildsResult2] = useExecuteActionLazy("get-children-2");

  const handleChangeParentId = useCallback((e: any) => {
    const parentId = e.target.value;
    fetchChilds({
      id: parentId,
    });
    fetchChilds2({
      id: parentId,
    });
  }, [fetchChilds, fetchChilds2]);

  return (
    <Flex direction="column" gap={2}>
      <Field name="parentId">
        {({ field, form }: FieldProps) => (
          <FormControl>
            <FormLabel>親ID</FormLabel>
            <ChakraSelect
              {...field}
              placeholder="選択してください"
              onChange={(e) => {
                field.onChange(e);
                handleChangeParentId(e);
              }}
            >
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>
        )}
      </Field>
      {
        !values.parentId ? <></> : (
          <>
            {
              fetchChildsResult.loading || !fetchChildsResult.data ? (
                <Box textAlign="center" py={4}>
                  <Spinner />
                </Box>
              ) : (
                <Field name="childId">
                  {({ field }: FieldProps) => (
                    <FormControl>
                      <FormLabel>子ID</FormLabel>
                      <ChakraSelect
                        {...field}
                        placeholder="選択してください"
                      >
                        {fetchChildsResult.data?.results[0].success.map((child: {
                          id: string;
                          name: string;
                        }) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </ChakraSelect>
                    </FormControl>
                  )}
                </Field>
              )
            }
            {
              fetchChildsResult2.loading || !fetchChildsResult2.data ? (
                <Box textAlign="center" py={4}>
                  <Spinner />
                </Box>
              ) : (
                <Field name="childId2">
                  {({ field }: FieldProps) => (
                    <FormControl>
                      <FormLabel>子ID2</FormLabel>
                      <ChakraSelect
                        {...field}
                        placeholder="選択してください"
                      >
                        {fetchChildsResult2.data?.results[0].success.map((child: {
                          id: string;
                          name: string;
                        }) => (
                          <option key={child.id} value={child.id}>
                            {child.name}
                          </option>
                        ))}
                      </ChakraSelect>
                    </FormControl>
                  )}
                </Field>
              )
            }
          </>
        )
      }
    </Flex>
  );
};

const App = () => {
  const { data, loading, error } =
    useExecuteAction("get-parents");

  if (error) {
    return <Box p={4}>Error: {error.message}</Box>;
  }

  return (
    <Flex direction="column" gap={2} w="full" h="full">
      <Heading size="sm">Dynamic Form</Heading>
      {(loading || !data) ?
        <Box textAlign="center" py={4}>
          <Spinner />
        </Box> :
        <Card p={4}>
          <Formik
            initialValues={{
              parentId: "",
              childId: "",
              childId2: "",
            }}
            onSubmit={() => { }}
          >
            {() => (
              <Form>
                <DynamicFormContent parents={data.results[0].success} />
              </Form>
            )}
          </Formik>
        </Card>
      }
    </Flex>
  );
};

export default App;
