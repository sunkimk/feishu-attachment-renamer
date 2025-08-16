import { basekit, FieldType, FieldComponent, FieldCode, field } from '@lark-opdev/block-basekit-server-api';

const { t } = field; // 引入 t 函数用于国际化

basekit.addField({
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'newPrefix',
      label: t('newPrefixLabel'), // 使用 t() 函数
      component: FieldComponent.Input,
      props: {
        placeholder: t('newPrefixPlaceholder'), // 使用 t() 函数
      },
      validator: {
        required: true,
      },
    },
  ],

  resultType: {
    type: FieldType.Attachment,
  },
  
  execute: async (formItemParams, context) => {
    try {
      // @ts-ignore
      const { sourceAttachments, newPrefix } = formItemParams;

      // @ts-ignore
      if (!sourceAttachments || sourceAttachments.length === 0) {
        return { code: FieldCode.Success, data: [] };
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

      return { code: FieldCode.Success, data: newAttachments };
    } catch (error) {
      console.log('批量重命名附件插件出错:', error);
      return { code: FieldCode.Error };
    }
  },
});

export default basekit;