/**
 * External dependencies
 *
 * @format
 */

import React from 'react';

/**
 * Internal dependencies
 */
import Head from 'components/head';
import EmptyContent from 'components/empty-content';

function PrivacyVN( { faviconURL } ) {
	return (
		<html lang="en">
			<Head
				title="Privacy policy — Papovn.com"
				faviconURL={ faviconURL }
				cdn={ '//www.papovn.com/papo' }
			>
				<link rel="stylesheet" id="main-css" href={ '/papo/style-debug.css' } type="text/css" />
			</Head>
			<body>
				{ /* eslint-disable wpcalypso/jsx-classname-namespace*/ }
				<div id="wpcom" className="wpcom-site">
					<div className="wp has-no-sidebar">
						<div className="layout__content" id="content">
							<div className="layout__primary" id="primary">
								<main className="privacy__main main" role="main">
									<EmptyContent
										illustration="/papo/images/illustrations/security.svg"
										title="Privacy policy"
										line={ [
											'Privacy policy of ',
											<a key="dashboard-link" href="https://www.papovn.com">
												www.papovn.com
											</a>,
											' (include Papo Facebook App)',
											'.',
										] }
									>
										<div className="privacy__content">
											<p>
												<em>
													Ngày có hiệu lực: ngày 10 tháng 9 năm 2018. Thay đổi cuối cùng: ngày 16
													tháng 9 năm 2018
												</em>
											</p>
											<p>
												Papo ("chúng tôi", hay "của chúng tôi") ở đây chỉ website papovn.com ("Dịch
												vụ").
											</p>
											<p>
												Trang này thông báo cho bạn các chính sách của chúng tôi về việc thu thập,
												sử dụng và tiết lộ dữ liệu cá nhân khi bạn sử dụng Dịch vụ của chúng tôi và
												các lựa chọn bạn đã liên kết với dữ liệu đó.
											</p>
											<p>
												Chúng tôi sử dụng dữ liệu của bạn để cung cấp và cải thiện Dịch vụ. Bằng
												cách sử dụng Dịch vụ, bạn đồng ý với việc thu thập và sử dụng thông tin theo
												chính sách này. Trừ khi được quy định khác trong Chính sách bảo mật này, các
												điều khoản được sử dụng trong Chính sách quyền riêng tư này có cùng ý nghĩa
												như trong Điều khoản và điều kiện của chúng tôi, có thể truy cập từ
												papovn.com
											</p>
											<h2 className="privacy__header">
												Quyền ứng dụng Facebook (Facebook Technology App)
											</h2>
											<p>
												Ứng dụng sẽ cần các quyền sau từ tài khoản Facebook của bạn để hoạt động
												bình thường. Bạn sẽ được nhắc yêu cầu các quyền này khi đăng nhập lần đầu
												vào ứng dụng của chúng tôi. Ứng dụng sẽ không hoạt động chính xác nếu không
												có bất kỳ quyền yêu cầu nào::
											</p>
											<ul>
												<li>
													<strong>manage_pages*:</strong> để truy xuất danh sách và mã thông báo
													truy cập của Trang mà bạn quản trị
												</li>
												<li>
													<strong>publish_pages*:</strong> để trả lời bình luận, như bình luận thay
													mặt cho Trang mà bạn quản lý
												</li>
												<li>
													<strong>read_page_mailboxes*, pages_messaging*:</strong> để đọc, nhận và
													trả lời tin nhắn của Pages
												</li>
												<li>
													<strong>business_management (tùy chọn):</strong> để quản lý tài sản doanh
													nghiệp của bạn
												</li>
												<li>
													<strong>pages_messaging_subscriptions*:</strong> để gửi tin nhắn bằng
													Trang Facebook bất cứ lúc nào sau lần tương tác người dùng đầu tiên
												</li>
											</ul>
											<h2 className="privacy__header">Thu thập và sử dụng thông tin</h2>
											<p>
												Chúng tôi thu thập một số loại thông tin khác nhau cho các mục đích khác
												nhau để cung cấp và cải thiện Dịch vụ của chúng tôi cho bạn.
											</p>
											<h3 className="privacy__sub-header">Các loại dữ liệu được thu thập</h3>
											<h4 className="privacy__sub-sub-header">Dữ liệu cá nhân</h4>
											<p>
												Khi sử dụng Dịch vụ của chúng tôi, chúng tôi có thể yêu cầu bạn cung cấp cho
												chúng tôi thông tin nhận dạng cá nhân nhất định có thể được sử dụng để liên
												hệ hoặc nhận dạng bạn ("Dữ liệu cá nhân"). Thông tin nhận dạng cá nhân có
												thể bao gồm, nhưng không giới hạn ở:
											</p>
											<ul>
												<li>Địa chỉ email</li>
												<li>Tên và họ</li>
												<li>Cookies và dữ liệu sử dụng</li>
											</ul>
											<h4 className="privacy__sub-sub-header">Dữ liệu sử dụng</h4>
											<p>
												Chúng tôi cũng có thể thu thập thông tin về cách Dịch vụ được truy cập và sử
												dụng ("Dữ liệu sử dụng"). Dữ liệu sử dụng này có thể bao gồm thông tin như
												địa chỉ Giao thức Internet của máy tính của bạn (ví dụ: địa chỉ IP), loại
												trình duyệt, phiên bản trình duyệt, các trang Dịch vụ của chúng tôi mà bạn
												truy cập, thời gian và ngày bạn truy cập, thời gian dành cho các trang đó,
												duy nhất định danh thiết bị và dữ liệu chẩn đoán khác.
											</p>
											<h4 className="privacy__sub-sub-header">Theo dõi & dữ liệu cookie</h4>
											<p>
												Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để theo dõi hoạt
												động trên Dịch vụ của mình và giữ một số thông tin nhất định.
											</p>
											<p>
												Cookies là các tệp có lượng dữ liệu nhỏ có thể bao gồm một định danh duy
												nhất ẩn danh. Cookies được gửi đến trình duyệt của bạn từ một trang web và
												được lưu trữ trên thiết bị của bạn. Các công nghệ theo dõi cũng được sử dụng
												là đèn hiệu, thẻ và tập lệnh để thu thập và theo dõi thông tin cũng như cải
												thiện và phân tích Dịch vụ của chúng tôi.
											</p>
											<p>
												Bạn có thể cài đặt trình duyệt của mình từ chối tất cả các cookie hoặc cho
												biết khi nào cookie được gửi. Tuy nhiên, nếu bạn không chấp nhận cookie, bạn
												không thể sử dụng một số phần của Dịch vụ của chúng tôi.
											</p>
											<p>Ví dụ về Cookies chúng tôi sử dụng:</p>
											<ul>
												<li>
													<strong>Sessions Cookies.</strong> Chúng tôi sử dụng Cookies phiên làm
													việc để vận hành dịch vụ của mình.
												</li>
												<li>
													<strong>Preference Cookies.</strong> Chúng tôi sử dụng Cookie ưu tiên để
													ghi nhớ tùy chọn của bạn và các cài đặt khác nhau.
												</li>
												<li>
													<strong>Security Cookies.</strong> Chúng tôi sử dụng Cookies bảo mật cho
													mục đích bảo mật.
												</li>
											</ul>
											<h2 className="privacy__header">Sử dụng dữ liệu</h2>
											<p>Papo sử dụng dữ liệu thu thập cho các mục đích khác nhau:</p>
											<ul>
												<li>Cung cấp và duy trì Dịch vụ</li>
												<li>Để thông báo cho bạn về những thay đổi dịch vụ của chúng tôi</li>
												<li>
													Để cho phép bạn tham gia các tính năng tương tác của Dịch vụ của chúng tôi
													khi bạn chọn làm như vậy
												</li>
												<li>Để cung cấp chăm sóc và hỗ trợ khách hàng</li>
												<li>
													Để cung cấp phân tích hoặc thông tin có giá trị để chúng tôi có thể cải
													thiện Dịch vụ
												</li>
												<li>Để theo dõi việc sử dụng Dịch vụ</li>
												<li>Để phát hiện, ngăn chặn và giải quyết các vấn đề kỹ thuật</li>
											</ul>
											<h2 className="privacy__header">Chuyển dữ liệu</h2>
											<p>
												Thông tin của bạn, bao gồm Dữ liệu Cá nhân, có thể được chuyển đến - và được
												duy trì trên - các máy tính nằm ngoài tiểu bang, tỉnh, quốc gia hoặc khu vực
												tài phán chính phủ khác nơi luật bảo vệ dữ liệu có thể khác với các quyền từ
												thẩm quyền của bạn.
											</p>
											<p>
												Nếu bạn ở bên ngoài Việt Nam và chọn cung cấp thông tin cho chúng tôi, xin
												lưu ý rằng chúng tôi chuyển dữ liệu, bao gồm Dữ liệu cá nhân sang Việt Nam
												và xử lý dữ liệu đó tại đó.
											</p>
											<p>
												Sự đồng ý của bạn đối với Chính sách quyền riêng tư này kèm theo việc bạn
												gửi thông tin đó thể hiện sự đồng ý của bạn đối với chuyển khoản đó.
											</p>
											<p>
												Papo sẽ thực hiện tất cả các bước cần thiết một cách hợp lý để đảm bảo rằng
												dữ liệu của bạn được xử lý an toàn và tuân thủ Chính sách bảo mật này và sẽ
												không có việc chuyển Dữ liệu cá nhân của bạn đến một tổ chức hoặc quốc gia
												trừ khi có các biện pháp kiểm soát thích hợp dữ liệu và thông tin cá nhân
												khác.
											</p>
											<h2 className="privacy__header">Tiết lộ dữ liệu</h2>
											<h3 className="privacy__sub-header">Yêu cầu pháp lý</h3>
											<p>
												Papo có thể tiết lộ Dữ liệu Cá nhân của bạn với niềm tin tốt rằng hành động
												đó là cần thiết để:
											</p>
											<ul>
												<li>Tuân thủ nghĩa vụ pháp lý</li>
												<li>Để bảo vệ và bảo vệ các quyền hoặc tài sản của Papo</li>
												<li>
													Để ngăn chặn hoặc điều tra các hành vi sai trái có thể liên quan đến Dịch
													vụ
												</li>
												<li>Để bảo vệ sự an toàn cá nhân của người dùng Dịch vụ hoặc cộng đồng</li>
												<li>Để bảo vệ chống lại trách nhiệm pháp lý</li>
											</ul>
											<h2 className="privacy__header">Bảo mật dữ liệu</h2>
											<p>
												Bảo mật dữ liệu của bạn rất quan trọng đối với chúng tôi, nhưng hãy nhớ rằng
												không có phương thức truyền qua Internet hoặc phương pháp lưu trữ điện tử
												nào an toàn 100%. Mặc dù chúng tôi cố gắng sử dụng các phương tiện thương
												mại có thể chấp nhận để bảo vệ Dữ liệu Cá nhân của bạn, chúng tôi không thể
												đảm bảo tính bảo mật tuyệt đối của nó.
											</p>
											<h2 className="privacy__header">Các nhà cung cấp dịch vụ</h2>
											<p>
												Chúng tôi có thể sử dụng các công ty và cá nhân bên thứ ba để tạo điều kiện
												cho Dịch vụ của chúng tôi ("Nhà cung cấp dịch vụ"), thay mặt chúng tôi cung
												cấp Dịch vụ, để thực hiện các dịch vụ liên quan đến Dịch vụ hoặc hỗ trợ
												chúng tôi phân tích cách sử dụng Dịch vụ của chúng tôi.
											</p>
											<p>
												Các bên thứ ba này chỉ có quyền truy cập vào Dữ liệu Cá nhân của bạn để thực
												hiện các nhiệm vụ này thay mặt chúng tôi và có nghĩa vụ không tiết lộ hoặc
												sử dụng nó cho bất kỳ mục đích nào khác.
											</p>
											<h3 className="privacy__sub-header">Phân tích</h3>
											<p>
												Chúng tôi có thể sử dụng Nhà cung cấp dịch vụ bên thứ ba để theo dõi và phân
												tích việc sử dụng Dịch vụ của chúng tôi.
											</p>
											<ul>
												<li>
													<p>
														<strong>Google Analytics</strong>
													</p>
													<p>
														Google Analytics là một dịch vụ phân tích trang web được cung cấp bởi
														Google để theo dõi và báo cáo lưu lượng truy cập trang web. Google sử
														dụng dữ liệu được thu thập để theo dõi và giám sát việc sử dụng Dịch vụ
														của chúng tôi. Dữ liệu này được chia sẻ với các dịch vụ khác của Google.
														Google có thể sử dụng dữ liệu được thu thập để ngữ cảnh hóa và cá nhân
														hóa quảng cáo của mạng quảng cáo của riêng mình.
													</p>
													<p>
														Bạn có thể từ chối cung cấp hoạt động của mình trên Dịch vụ cho Google
														Analytics bằng cách cài đặt tiện ích bổ sung trình duyệt từ chối Google
														Analytics. Tiện ích bổ sung ngăn Google Analytics JavaScript (ga.js,
														analytics.js và dc.js) chia sẻ thông tin với Google Analytics về hoạt
														động truy cập.
													</p>
													<p>
														Để biết thêm thông tin về thực tiễn bảo mật của Google, vui lòng truy
														cập trang web Điều khoản và quyền riêng tư của Google:{' '}
														<a href="https://policies.google.com/privacy?hl=en">
															https://policies.google.com/privacy?hl=en
														</a>
													</p>
												</li>
											</ul>
											<h2 className="privacy__header">Liên kết đến các trang web khác</h2>
											<p>
												Dịch vụ của chúng tôi có thể chứa các liên kết đến các trang web khác không
												do chúng tôi điều hành. Nếu bạn nhấp vào liên kết của bên thứ ba, bạn sẽ
												được chuyển đến trang web của bên thứ ba đó. Chúng tôi khuyên bạn nên xem
												lại Chính sách quyền riêng tư của mỗi trang web bạn truy cập.
											</p>
											<p>
												Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách
												bảo mật hoặc thông lệ của bất kỳ trang web hoặc dịch vụ bên thứ ba nào.
											</p>
											<h2 className="privacy__header">Quyền riêng tư của trẻ em</h2>
											<p>
												không giải quyết bất cứ ai dưới 13 tuổi. Chúng tôi không cố ý thu thập thông
												tin nhận dạng cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn là cha mẹ hoặc người
												giám hộ và bạn biết rằng con bạn đã cung cấp cho chúng tôi thông tin cá
												nhân, vui lòng liên hệ với chúng tôi để chúng tôi có thể thực hiện các hành
												động cần thiết.
											</p>
											<p>
												Chúng tôi không cố ý thu thập thông tin cá nhân từ bất kỳ ai dưới 18 tuổi.
												Nếu bạn là cha mẹ hoặc người giám hộ và bạn biết rằng Con cái của bạn đã
												cung cấp cho chúng tôi Dữ liệu Cá nhân, vui lòng liên hệ với chúng tôi. Nếu
												chúng tôi biết rằng chúng tôi đã thu thập Dữ liệu Cá nhân từ trẻ em mà không
												cần xác minh về sự đồng ý của cha mẹ, chúng tôi sẽ thực hiện các bước để xóa
												thông tin đó khỏi máy chủ của chúng tôi.
											</p>
											<h2 className="privacy__header">Thay đổi chính sách bảo mật này</h2>
											<p>
												Chúng tôi có thể cập nhật Chính sách bảo mật của chúng tôi theo thời gian.
												Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính
												sách bảo mật mới trên trang này.
											</p>
											<p>
												Chúng tôi sẽ cho bạn biết qua email và / hoặc thông báo nổi bật về Dịch vụ
												của chúng tôi, trước khi thay đổi có hiệu lực và cập nhật "ngày có hiệu lực"
												ở đầu Chính sách bảo mật này.
											</p>
											<p>
												Bạn nên xem lại Chính sách quyền riêng tư này định kỳ để biết mọi thay đổi.
												Thay đổi đối với Chính sách quyền riêng tư này có hiệu lực khi chúng được
												đăng trên trang này.
											</p>
											<h2 className="privacy__header">Liên hệ chúng tôi</h2>
											<p>
												Nếu bạn có bất kỳ câu hỏi nào về Chính sách quyền riêng tư này, vui lòng
												liên hệ với chúng tôi:
											</p>
											<ul>
												<li>Email liên hệ: admin@papovn.com</li>
											</ul>
										</div>
									</EmptyContent>
								</main>
							</div>
						</div>
					</div>
				</div>
				{ /* eslint-enable wpcalypso/jsx-classname-namespace*/ }
			</body>
		</html>
	);
}

export default PrivacyVN;
