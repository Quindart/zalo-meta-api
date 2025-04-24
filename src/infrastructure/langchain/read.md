## Main Flow:

- Step 1: Absolute path file, File such as CSV, PDF,..
- Step 2: change file to Loader => return PDFLoader (this `class PDFLoader extends BufferLoader`)

- Step 3: PDFLoader => use function load() => return Promise Document List
- Step 4:
- `A Document object` in LangChain contains information about some data. It has two attributes:

- `pageContent`: string: The content of this document. Currently is only a string.
- `metadata`: Record<string, any>: Arbitrary metadata associated with this document. Can track the document id, file name, etc.

> [About: Document loaders,Text splitters,Embedding models ](https://js.langchain.com/docs/concepts/#document-loaders)

## Buffer file?

[Buffer docs](https://www.sourceinsight.com/doc/v3/af916266.htm)

`Buffer (bộ đệm) thực sự giống như một vùng chứa tạm thời, đóng vai trò như một "đệm" để chứa các gói tin (packets) dữ liệu khi chúng được truyền đi hoặc nhận về.`

Hãy hình dung buffer như một hộp thư:

Các gói tin: Là những lá thư chứa đựng dữ liệu.
Buffer: Là chiếc hộp thư nơi các lá thư được tập kết trước khi được đưa đi phân loại hoặc chờ người nhận lấy.
Tại sao cần buffer?

Điều hòa lưu lượng: Giống như hộp thư giúp điều hòa việc gửi và nhận thư, buffer giúp điều tiết tốc độ truyền dữ liệu giữa các thiết bị có tốc độ khác nhau.
Ngăn ngừa mất mát: Nếu các gói tin đến quá nhanh, buffer sẽ tạm thời lưu trữ chúng, tránh tình trạng tràn bộ nhớ và mất dữ liệu.
Xử lý lỗi: Nếu có gói tin bị hư hỏng hoặc mất mát trong quá trình truyền, buffer sẽ giúp phát hiện và yêu cầu gửi lại gói tin đó.

```javascript
export declare class PDFLoader extends BufferLoader {
    private splitPages;
    private pdfjs;
    protected parsedItemSeparator: string;
    constructor(filePathOrBlob: string | Blob, { splitPages, pdfjs, parsedItemSeparator, }?: {
        splitPages?: boolean | undefined;
        pdfjs?: typeof PDFLoaderImports | undefined;
        parsedItemSeparator?: string | undefined;
    });
    /**
     * @param raw The buffer to be parsed.
     * @param metadata The metadata of the document.
     * @returns A promise that resolves to an array of `Document` instances.
     */
    parse(raw: Buffer, metadata: Document["metadata"]): Promise<Document[]>;
}
```

# Text splitting type

### main topic : [recursive_text_splitter](https://js.langchain.com/docs/how_to/recursive_text_splitter)

![alt text](/assets/image.png)
