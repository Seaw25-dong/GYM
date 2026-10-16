# Kết quả sửa Call of Duty Secure Attestation — 11/10/2026

Đã chạy lại công cụ COD Secure Attestation Wizard trên máy. Kết quả: **System compliant**, TPM 2.0 và Secure Boot đều đạt. Ảnh: [cod-attestation-after.png](cod-attestation-after.png). Nhật ký: [cod-scan-result.txt](cod-scan-result.txt).

## Nguyên nhân xác minh trên máy

- ASUS PRIME H610M-K D4, BIOS 4004, Intel ME 16.1.40.2765; TPM Intel PTT ADL 600.18.1040.2765.
- TPM sẵn sàng xác thực, không bị khóa, không cần Clear TPM.
- Đăng ký AIK ban đầu bị HTTP 400 / 0x80190190: `No valid TPM EK/Platform certificate provided in the TPM identity request message.`
- Ba CA trung gian trong cache TPM WMI của Windows khác ba bản gốc trong TPM NV. Chuỗi sử dụng cache báo `NotSignatureValid`; chuỗi sử dụng bản gốc hết lỗi chữ ký.
- EK leaf trong Windows và TPM NV giống nhau. Đã đối chiếu thêm toàn bộ chữ ký đến CA gốc tải từ URL chính thức Intel; các CA phía trên chỉ được dùng trong bộ nhớ để kiểm tra.

## Thay đổi đã thực hiện

Đã sao lưu cache registry và danh sách kho CA vào `tpm-backup-20261011-225317`, rồi thêm đúng ba CA của TPM máy này vào `LocalMachine\CA`:

| Chứng chỉ | Thumbprint |
| --- | --- |
| CSME ADL PTT 01SVN | 3706D6CC75ACF3E4AF4E6C57E637DA7EE65691FC |
| CSME ADL SVN01 Kernel CA | 84B0D83C9D78D0B00F796C430BCBA32C5C609BE5 |
| CSME ADL ROM CA | 97E87874DA2DD9E358224A350675D2243AD26B0F |

Không sửa registry hệ thống, không thêm Trusted Root, không Clear TPM, không xóa khóa.

Sau khi bổ sung CA, endpoint tự chọn của certreq bị HTTP 404. Đã đăng ký lại khóa ActivisionAIK hiện có tới endpoint Microsoft tương ứng SKI của Intel ADL issuing CA được xác minh:

```text
https://INTC-KeyId-34219b21f477f6c7f78a0f26b23d0430deea4363.microsoftaik.azure.net/templates/Aik/scep
```

Kết quả HTTP 200, `EnrollStatus(1): Enrolled`, exit code 0. Chứng chỉ được lưu trên khóa thông qua Windows CNG; thumbprint `4B8755E596435C077CC32722918358FF80AF43D4`. Hash khóa công khai trước và sau giống nhau. Nhật ký: [tpm-aik-verified-issuer-retry.txt](tpm-aik-verified-issuer-retry.txt), [tpm-aik-persisted-check.txt](tpm-aik-persisted-check.txt).

Người dùng đã chấp thuận rõ việc gửi dữ liệu xác thực TPM/AIK đến dịch vụ Microsoft để đăng ký và kiểm tra lại.

## Tệp phục vụ kiểm tra và hoàn tác

- [tpm-nv-read.ps1](tpm-nv-read.ps1): chỉ đọc các chỉ mục chứng chỉ TPM qua API TBS. Lệnh TPM được giới hạn ở GetCapability, NV_ReadPublic và NV_Read.
- [tpm-repair.ps1](tpm-repair.ps1): mặc định chỉ xem trước; `-Rollback` gỡ đúng các CA do lần sửa này bổ sung, theo [manifest](tpm-repair-manifest.json).
- [tpm-aik-verify.ps1](tpm-aik-verify.ps1): `-ReadOnly` đọc chứng chỉ trên khóa. `-UseVerifiedIssuerEndpoint` đăng ký AIK tại Microsoft; cần quyền Administrator và gửi dữ liệu xác thực ra ngoài.
- [cod-scan.ps1](cod-scan.ps1): chạy Run Scan trong cửa sổ công cụ COD hiện có và ghi kết quả; yêu cầu cửa sổ đang ở Home.

## Nguồn tham khảo

Hướng sửa CA trung gian từ TPM riêng được người dùng Intel Alder Lake báo thành công trên [Reddit](https://www.reddit.com/r/modernwarfare4/comments/1w9i76x/fix_cod_secure_attestation_failed_new_key_failed/). Đã đối chiếu cấu trúc CA và vị trí NV với [giải thích của nhân viên Intel](https://community.intel.com/t5/Mobile-and-Desktop-Processors/How-to-verify-an-Intel-PTT-endorsement-key-certificate/td-p/1603153).

[Video YouTube về cùng lỗi](https://www.youtube.com/watch?v=c6pLu46W1vU) được người dùng chia sẻ trên [diễn đàn ASUS](https://rog-forum.asus.com/t5/gaming-desktops/resolved-asus-rog-strix-g15dk-call-of-duty-quot-failed/m-p/1159032). Không truy cập được nội dung video trực tiếp. Cách xóa toàn bộ Endorsement được trích trên diễn đàn không được áp dụng; lần sửa này dựa trên kiểm tra chữ ký của chứng chỉ máy thực tế.

Tài liệu [Microsoft TBS](https://learn.microsoft.com/en-us/windows/win32/api/tbs/nf-tbs-tbsip_submit_command) hỗ trợ cách đọc TPM. [Mẫu AIK của Microsoft](https://github.com/microsoft/Attestation-Client-Samples/blob/main/EnrollAik.ps1) và trợ giúp certreq cài trên máy được dùng để kiểm tra tham số enrollment. [Hướng dẫn Activision](https://support.activision.com/au/en/articles/trusted-platform-module-and-secure-boot) mô tả công cụ và trạng thái System compliant.
