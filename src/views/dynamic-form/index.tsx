import {
  Select, LoadingIndicator,
  useExecuteAction,
  useExecuteActionLazy,
  Form,
  Card
} from "@basemachina/view";
import { useFormikContext } from "formik";
import {
  Heading
} from "@chakra-ui/react";
import { useCallback } from "react";

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
    <div className="flex flex-col gap-2">
      <Select
        name="parentId"
        label="親ID"
        options={[
          {
            label: "選択してください",
            value: "",
          },
          ...parents.map((parent) => ({
            label: parent.name,
            value: parent.id,
          })),
        ]}
        onChange={handleChangeParentId}
      />
      {
        !values.parentId ? <></> : (
          <>
            {
              fetchChildsResult.loading || !fetchChildsResult.data ? (
                <LoadingIndicator />
              ) : (
                <Select name="childId" label="子ID" options={[
                  {
                    label: "選択してください",
                    value: "",
                  },
                  ...fetchChildsResult.data?.results[0].success.map((child: {
                    id: string;
                    name: string;
                  }) => {
                    return {
                      label: child.name,
                      value: child.id,
                    };
                  })
                ]} />
              )
            }
            {
              fetchChildsResult2.loading || !fetchChildsResult2.data ? (
                <LoadingIndicator />
              ) : (
                <Select name="childId2" label="子ID2" options={
                  [
                    {
                      label: "選択してください",
                      value: "",
                    },
                    ...fetchChildsResult2.data?.results[0].success.map((child: {
                      id: string;
                      name: string;
                    }) => {
                      return {
                        label: child.name,
                        value: child.id,
                      };
                    })
                  ]} />
              )
            }
          </>
        )
      }
    </div>
  );
};

const App = () => {
  const { data, loading, error } =
    useExecuteAction("get-parents");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Heading size="sm">Dynamic Form</Heading>
      {(loading || !data) ?
        <LoadingIndicator /> :
        <Card>
          <Form
            initialValues={{
              parentId: "",
              childId: "",
              childId2: "",
            }}
            onSubmit={() => { }}>
            <DynamicFormContent parents={data.results[0].success} />
          </Form>
        </Card>
      }

    </div>
  );
};

export default App;
