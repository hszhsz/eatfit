import Foundation

enum APIError: LocalizedError {
    case invalidBaseURL
    case invalidResponse
    case server(statusCode: Int, message: String)

    var errorDescription: String? {
        switch self {
        case .invalidBaseURL:
            return "服务地址无效，请检查后端地址配置。"
        case .invalidResponse:
            return "服务响应格式异常。"
        case let .server(statusCode, message):
            return "请求失败（\(statusCode)）：\(message)"
        }
    }
}

struct APIClient {
    let baseURLString: String

    private var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }

    private var encoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        return encoder
    }

    private func makeURL(path: String, queryItems: [URLQueryItem] = []) throws -> URL {
        guard var components = URLComponents(string: baseURLString) else {
            throw APIError.invalidBaseURL
        }
        let normalizedPath = path.hasPrefix("/") ? path : "/" + path
        components.path = normalizedPath
        components.queryItems = queryItems.isEmpty ? nil : queryItems
        guard let url = components.url else {
            throw APIError.invalidBaseURL
        }
        return url
    }

    private func send<Response: Decodable>(
        _ path: String,
        method: String = "GET",
        queryItems: [URLQueryItem] = [],
        body: Encodable? = nil
    ) async throws -> Response {
        let url = try makeURL(path: path, queryItems: queryItems)
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body {
            request.httpBody = try AnyEncodable(body).encode(using: encoder)
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200 ..< 300).contains(httpResponse.statusCode) else {
            let message = String(data: data, encoding: .utf8) ?? "未知错误"
            throw APIError.server(statusCode: httpResponse.statusCode, message: message)
        }

        return try decoder.decode(Response.self, from: data)
    }

    func createProfile(_ payload: UserProfilePayload) async throws -> UserProfile {
        try await send("/api/profiles", method: "POST", body: payload)
    }

    func getProfile(id: Int) async throws -> UserProfile {
        try await send("/api/profiles/\(id)")
    }

    func updateProfile(id: Int, payload: UserProfilePayload) async throws -> UserProfile {
        try await send("/api/profiles/\(id)", method: "PUT", body: payload)
    }

    func getTarget(id: Int) async throws -> NutritionTarget {
        try await send("/api/profiles/\(id)/target")
    }

    func listRecipes(mealType: MealType? = nil, tag: String? = nil) async throws -> [Recipe] {
        var queryItems: [URLQueryItem] = []
        if let mealType {
            queryItems.append(URLQueryItem(name: "meal_type", value: mealType.rawValue))
        }
        if let tag, !tag.isEmpty {
            queryItems.append(URLQueryItem(name: "tag", value: tag))
        }
        return try await send("/api/recipes", queryItems: queryItems)
    }

    func getRecipe(id: Int) async throws -> Recipe {
        try await send("/api/recipes/\(id)")
    }

    func getDailyPlan(profileId: Int, date: String? = nil) async throws -> DailyPlan {
        let queryItems = date.map { [URLQueryItem(name: "date", value: $0)] } ?? []
        return try await send("/api/plan/\(profileId)", queryItems: queryItems)
    }

    func getGroceryList(profileId: Int, date: String? = nil) async throws -> GroceryList {
        let queryItems = date.map { [URLQueryItem(name: "date", value: $0)] } ?? []
        return try await send("/api/plan/\(profileId)/grocery", queryItems: queryItems)
    }

    func getCoachAdvice(profileId: Int, request: CoachRequest) async throws -> CoachResponse {
        try await send("/api/coach/\(profileId)/advice", method: "POST", body: request)
    }
}

private struct AnyEncodable: Encodable {
    private let encodeClosure: (Encoder) throws -> Void

    init(_ value: Encodable) {
        encodeClosure = value.encode(to:)
    }

    func encode(to encoder: Encoder) throws {
        try encodeClosure(encoder)
    }

    func encode(using encoder: JSONEncoder) throws -> Data {
        try encoder.encode(self)
    }
}
