import { Box } from "@chakra-ui/react";
import CheckboxTable, { TableColumn, TableAction } from "./CheckboxTable";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
};

const sampleUsers: User[] = [
    { id: 1, name: "田中太郎", email: "tanaka@example.com", role: "管理者", status: "active" },
    { id: 2, name: "佐藤花子", email: "sato@example.com", role: "編集者", status: "active" },
    { id: 3, name: "山田次郎", email: "yamada@example.com", role: "閲覧者", status: "inactive" },
    { id: 4, name: "鈴木三郎", email: "suzuki@example.com", role: "編集者", status: "active" },
    { id: 5, name: "高橋美咲", email: "takahashi@example.com", role: "管理者", status: "active" },
];

const columns: TableColumn<User>[] = [
    { key: "name", header: "名前" },
    { key: "email", header: "メールアドレス" },
    { key: "role", header: "役割" },
    {
        key: "status",
        header: "ステータス",
        render: (value: User["status"]) => (
            <Box
                px={2}
                py={1}
                borderRadius="md"
                bg={value === "active" ? "green.100" : "gray.100"}
                color={value === "active" ? "green.800" : "gray.800"}
                display="inline-block"
                fontSize="sm"
            >
                {value === "active" ? "アクティブ" : "非アクティブ"}
            </Box>
        ),
    },
];

const actions: TableAction<User>[] = [
    {
        label: "選択したユーザーに通知を送信",
        onClick: (selectedUsers) => {
            if (selectedUsers.length === 0) {
                window.alert("ユーザーが選択されていません");
                return;
            }

            // 実際の通知処理はコメントアウト
            // sendNotificationToUsers(selectedUsers.map(user => user.id));

            window.alert(`選択されたユーザーのID: ${selectedUsers.map(user => user.id).join(", ")}`);
        },
        requiresSelection: true,
    },
    {
        label: "全ユーザー統計を表示",
        onClick: (selectedUsers) => {
            window.alert(`全ユーザー数: ${sampleUsers.length}人\n選択中: ${selectedUsers.length}人`);
        },
        requiresSelection: false,
    },
];

export default function TableWithCheckbox() {
    return (
        <CheckboxTable
            title="ユーザー一覧 (チェックボックス付きテーブル)"
            data={sampleUsers}
            columns={columns}
            actions={actions}
            getItemId={(user) => user.id}
        />
    );
}