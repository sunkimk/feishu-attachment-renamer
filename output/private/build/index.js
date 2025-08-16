"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field; // 引入 t 函数用于国际化
block_basekit_server_api_1.basekit.addField({
    // --- 国际化配置 ---
    i18n: {
        messages: {
            'zh-CN': {
                'sourceFieldLabel': '源附件字段',
                'newPrefixLabel': '新的文件名前缀',
                'newPrefixPlaceholder': '请输入新的文件名前缀'
            },
            'en-US': {
                'sourceFieldLabel': 'Source Attachment Field',
                'newPrefixLabel': 'New Filename Prefix',
                'newPrefixPlaceholder': 'Enter the new filename prefix'
            },
            'ja-JP': {
                'sourceFieldLabel': 'ソース添付ファイルフィールド',
                'newPrefixLabel': '新しいファイル名のプレフィックス',
                'newPrefixPlaceholder': '新しいファイル名のプレフィックスを入力してください'
            }
        }
    },
    formItems: [
        {
            key: 'sourceAttachments',
            label: t('sourceFieldLabel'), // 使用 t() 函数
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            },
        },
        {
            key: 'newPrefix',
            label: t('newPrefixLabel'), // 使用 t() 函数
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('newPrefixPlaceholder'), // 使用 t() 函数
            },
            validator: {
                required: true,
            },
        },
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    execute: async (formItemParams, context) => {
        try {
            // @ts-ignore
            const { sourceAttachments, newPrefix } = formItemParams;
            // @ts-ignore
            if (!sourceAttachments || sourceAttachments.length === 0) {
                return { code: block_basekit_server_api_1.FieldCode.Success, data: [] };
            }
            const nameFrequencies = {};
            // @ts-ignore
            sourceAttachments.forEach(attachment => {
                // @ts-ignore
                const originalName = attachment.name;
                const lastDotIndex = originalName.lastIndexOf('.');
                const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
                const baseName = `${newPrefix}${extension}`;
                // @ts-ignore
                nameFrequencies[baseName] = (nameFrequencies[baseName] || 0) + 1;
            });
            const duplicateCounters = {};
            // @ts-ignore
            const newAttachments = sourceAttachments.map((attachment) => {
                // @ts-ignore
                const originalName = attachment.name;
                const lastDotIndex = originalName.lastIndexOf('.');
                const extension = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : '';
                const baseName = `${newPrefix}${extension}`;
                let finalName = baseName;
                // @ts-ignore
                if (nameFrequencies[baseName] > 1) {
                    // @ts-ignore
                    const counter = (duplicateCounters[baseName] || 0) + 1;
                    // @ts-ignore
                    duplicateCounters[baseName] = counter;
                    const nameWithoutExt = baseName.substring(0, baseName.length - extension.length);
                    finalName = `${nameWithoutExt}_${counter}${extension}`;
                }
                return {
                    name: finalName,
                    // @ts-ignore
                    content: attachment.tmp_url,
                    contentType: 'attachment/url',
                };
            });
            return { code: block_basekit_server_api_1.FieldCode.Success, data: newAttachments };
        }
        catch (error) {
            console.log('批量重命名附件插件出错:', error);
            return { code: block_basekit_server_api_1.FieldCode.Error };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEc7QUFFNUcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUMsQ0FBQyxlQUFlO0FBRXBDLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxrQkFBa0IsRUFBRSxPQUFPO2dCQUMzQixnQkFBZ0IsRUFBRSxTQUFTO2dCQUMzQixzQkFBc0IsRUFBRSxZQUFZO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQixFQUFFLHlCQUF5QjtnQkFDN0MsZ0JBQWdCLEVBQUUscUJBQXFCO2dCQUN2QyxzQkFBc0IsRUFBRSwrQkFBK0I7YUFDeEQ7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCLEVBQUUsZ0JBQWdCO2dCQUNwQyxnQkFBZ0IsRUFBRSxrQkFBa0I7Z0JBQ3BDLHNCQUFzQixFQUFFLDJCQUEyQjthQUNwRDtTQUNGO0tBQ0Y7SUFFRCxTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxtQkFBbUI7WUFDeEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFlBQVk7WUFDMUMsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLENBQUMsb0NBQVMsQ0FBQyxVQUFVLENBQUM7YUFDcEM7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO1FBQ0Q7WUFDRSxHQUFHLEVBQUUsV0FBVztZQUNoQixLQUFLLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsWUFBWTtZQUN4QyxTQUFTLEVBQUUseUNBQWMsQ0FBQyxLQUFLO1lBQy9CLEtBQUssRUFBRTtnQkFDTCxX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